#!/usr/bin/env node
/**
 * Generates PNG thumbnails for the IFC gallery.
 *
 * Drives the real IfcViewer component in its hidden `?thumbnail=1` capture mode (a fixed-size,
 * chrome-free canvas forced to the light background) and reads `window.__ifcViewerThumbnail` -
 * a PNG data URL produced by `renderer.captureScreenshot()` once the model has finished loading.
 *
 * The model id list is parsed straight out of `src/data/ifcModels.ts` (the `createRemoteModel(...)`
 * calls), so it never drifts out of sync with the gallery/dropdown.
 *
 * Usage:
 *   node scripts/generate-ifc-thumbnails.mjs
 *   node scripts/generate-ifc-thumbnails.mjs --model snacks_detalj_bolter
 *   node scripts/generate-ifc-thumbnails.mjs --base-url http://localhost:5173 --headless
 *
 * Requires the @playwright/test devDependency and its Chromium browser:
 *   npm install
 *   npx playwright install chromium
 *
 * NOTE: this runs headed (visible browser window) by default. Headless Chromium's WebGPU/ANGLE
 * backend has been unreliable for this WASM renderer (captureScreenshot() never resolves, so
 * page.waitForFunction times out) - pass --headless to try it anyway on a machine where it works.
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const IFC_MODELS_SOURCE = path.join(ROOT_DIR, 'src', 'data', 'ifcModels.ts');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'thumbnails');
const DEV_SERVER_PORT = 5175;
const CAPTURE_TIMEOUT_MS = 60_000;
const SERVER_READY_TIMEOUT_MS = 60_000;

const args = process.argv.slice(2);
const getFlagValue = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const headless = args.includes('--headless');
const modelFilter = getFlagValue('--model');
const explicitBaseUrl = getFlagValue('--base-url');

/** Extracts every `createRemoteModel('<FileName>.ifc'` call to build the visible model id list. */
const extractVisibleModelIds = async () => {
  const source = await readFile(IFC_MODELS_SOURCE, 'utf8');
  const ids = [];

  for (const match of source.matchAll(/createRemoteModel\('([^']+\.ifc)'/g)) {
    ids.push(match[1].replace(/\.ifc$/i, '').toLowerCase());
  }

  if (!ids.length) {
    throw new Error(`No models found in ${IFC_MODELS_SOURCE}. Did the file move or change shape?`);
  }

  return ids;
};

const waitForServerReady = async (url, timeoutMs) => {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Server isn't accepting connections yet - keep polling.
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error(`Timed out waiting for the dev server at ${url}`);
};

/** Starts `vite` on a fixed port so thumbnails can be generated without a manual dev server. */
const startDevServer = () =>
  new Promise((resolve, reject) => {
    const child = spawn('npx', ['vite', '--port', String(DEV_SERVER_PORT), '--strictPort'], {
      cwd: ROOT_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let settled = false;
    let output = '';

    const onData = (chunk) => {
      output += chunk.toString();
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);

    child.on('exit', (code) => {
      if (!settled) {
        settled = true;
        reject(new Error(`vite dev server exited early (code ${code}).\n${output}`));
      }
    });

    // vite prints its "Local:" URL once ready, but polling the port is more robust than
    // scraping stdout, so just give it a moment to bind before we start polling.
    setTimeout(() => {
      settled = true;
      resolve(child);
    }, 1500);
  });

const captureThumbnail = async (page, baseUrl, modelId) => {
  const url = `${baseUrl}/ifc-viewer/${modelId}?thumbnail=1`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => window.__ifcViewerThumbnail !== undefined, undefined, {
    timeout: CAPTURE_TIMEOUT_MS,
  });

  const dataUrl = await page.evaluate(() => window.__ifcViewerThumbnail);

  if (!dataUrl) {
    throw new Error(`captureScreenshot() returned null for "${modelId}" (see browser console for details).`);
  }

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64, 'base64');
};

const main = async () => {
  const allModelIds = await extractVisibleModelIds();
  const modelIds = modelFilter ? allModelIds.filter((id) => id === modelFilter) : allModelIds;

  if (modelFilter && !modelIds.length) {
    throw new Error(`--model "${modelFilter}" did not match any of: ${allModelIds.join(', ')}`);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  let devServer = null;
  const baseUrl = explicitBaseUrl ?? `http://localhost:${DEV_SERVER_PORT}`;

  if (!explicitBaseUrl) {
    console.log(`Starting a temporary Vite dev server on ${baseUrl} ...`);
    devServer = await startDevServer();
  }

  const browser = await chromium.launch({
    headless,
    args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan'],
  });

  try {
    await waitForServerReady(baseUrl, SERVER_READY_TIMEOUT_MS);

    for (const modelId of modelIds) {
      const page = await browser.newPage({ viewport: { width: 640, height: 480 } });

      try {
        console.log(`Capturing "${modelId}" ...`);
        const png = await captureThumbnail(page, baseUrl, modelId);
        const outputPath = path.join(OUTPUT_DIR, `${modelId}.png`);
        await writeFile(outputPath, png);
        console.log(`  -> ${path.relative(ROOT_DIR, outputPath)} (${(png.length / 1024).toFixed(1)} KB)`);
      } catch (captureError) {
        console.error(`  ! Failed to capture "${modelId}": ${captureError.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    devServer?.kill();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

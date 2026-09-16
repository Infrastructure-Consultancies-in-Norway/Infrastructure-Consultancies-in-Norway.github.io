import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
const fromRoot = (path: string) => realpathSync(fileURLToPath(new URL(path, import.meta.url)))
const ifcLiteWasmPath = fromRoot('./node_modules/@ifc-lite/wasm/pkg/ifc-lite_bg.wasm')

const ifcLiteWasmDevServer = () => ({
  name: 'ifc-lite-wasm-dev-server',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (!request.url?.split('?')[0].endsWith('/node_modules/@ifc-lite/wasm/pkg/ifc-lite_bg.wasm')) {
        next()
        return
      }

      response.setHeader('Content-Type', 'application/wasm')
      response.end(readFileSync(ifcLiteWasmPath))
    })
  },
} satisfies import('vite').Plugin)

export default defineConfig({
  plugins: [react(), ifcLiteWasmDevServer()],
  base: '/',
  optimizeDeps: {
    exclude: ['@ifc-lite/geometry', '@ifc-lite/wasm'],
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-dev-runtime', 'react-router', 'react-router-dom'],
  },
  worker: {
    format: 'es',
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      react: fromRoot('./node_modules/react'),
      'react-dom': fromRoot('./node_modules/react-dom'),
      'react/jsx-runtime': fromRoot('./node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': fromRoot('./node_modules/react/jsx-dev-runtime.js'),
    },
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: false,
  },
  server: {
    fs: {
      strict: false,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})

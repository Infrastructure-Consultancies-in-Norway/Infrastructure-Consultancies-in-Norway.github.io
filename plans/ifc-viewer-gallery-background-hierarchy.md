# IFC Viewer: Gallery Landing, Background Switch, and Hierarchy Grouping

> **Disclaimer** — The SNACKS IFC viewer is in an **alpha state**. Models and their properties are shown
> **for information only** and are **not quality assured**. Geometry, property sets and quantities may be
> incomplete or incorrect. Do not use the viewer output as a basis for design, procurement or construction
> decisions. This plan is a working document and may change during implementation.

## Problem

`snacks-app/src/pages/IfcViewerPage.tsx` is a thin wrapper that renders `IfcViewer` directly, and
`snacks-app/src/components/IfcViewer.tsx` (701 lines) loads a single model chosen from a `<select>`.
Three gaps:

1. The 3D canvas background is hardcoded (renders near-black); users cannot choose light/dark.
2. There is no overview of the available detail models — users must guess from a dropdown label.
3. The hierarchy tree groups only by IFC entity type (`IfcBeam`, `IfcColumn`, ...), while the
   domain-meaningful grouping is the **Elementnavn** property (`BIM.05 - Elementnavn`).

## Approach

Keep `IfcViewer` as the single 3D component, but split routing into a **gallery** (`/ifc-viewer`) and a
**model view** (`/ifc-viewer/:modelId`). Add two user-controlled, `localStorage`-persisted viewer
preferences (background theme, hierarchy grouping). Thumbnails are **pre-generated PNGs** produced by a
Playwright script that drives the real viewer in a hidden "thumbnail" mode and are committed under
`snacks-app/public/thumbnails/`.

### Confirmed decisions

| Topic | Decision |
| --- | --- |
| Thumbnails | Pre-generated PNGs via Playwright script, committed to `public/thumbnails/` |
| Navigation | Route param `/ifc-viewer/:modelId` (deep-linkable, browser back works) |
| Model dropdown | Kept inside the viewer toolbar; changing it navigates to the new route |
| `Eksempelmodell_SNACks.ifc` | Kept in data but flagged `hidden: true`; excluded from gallery + dropdown |
| Elementnavn source | `BIM.05 - Elementnavn` → any `* - Elementnavn` → entity name → IFC type |
| Preferences | Persisted in `localStorage`; defaults stay light background + Elementnavn grouping |

### Key API findings (verified in `node_modules/@ifc-lite/renderer`)

- `renderer.render({ clearColor: [r, g, b, a], selectedIds })` — `RenderOptions.clearColor` exists
  (`dist/types.d.ts:190`), so the background is a per-frame render option, not CSS.
- `renderer.captureScreenshot(): Promise<string | null>` (`dist/index.d.ts:925`) returns a PNG data URL —
  exactly what the thumbnail script needs.
- Both the local sample model and the remote detail models contain
  `IFCPROPERTYSINGLEVALUE('BIM.05 - Elementnavn', ...)` and `'KON.13 - Elementnavn'`, reachable through
  `extractPropertiesOnDemand(store, expressId)` from `@ifc-lite/parser`.

## Design

### 1. Background light/dark switch

- New `backgroundTheme: 'light' | 'dark'` state in `IfcViewer`, default `'light'`, hydrated from
  `localStorage['snacks.ifcViewer.background']`.
- Constants: `light` → `[0.933, 0.949, 0.921, 1]` (matches `#eef2eb` panel colour),
  `dark` → `[0.055, 0.055, 0.059, 1]` (matches today's near-black look).
- Replace every direct `renderer.render(...)` call with a single `renderFrame(selectedId?)` helper that
  always injects the current `clearColor` from a ref. Call sites to convert: `renderSelection`,
  the `addMeshes` batch loop, and the post-`fitToView` render.
- A `useEffect` on `backgroundTheme` re-renders the frame immediately and writes `localStorage`.
- UI: a small segmented control (`Lys` / `Mørk`) in the viewer toolbar, `aria-pressed` on each button.
- CSS: drive `.ifc-viewer-canvas-panel` background and `.ifc-viewer-status` contrast from a
  `data-background="light|dark"` attribute on the shell, so the pre-render/loading state matches the
  chosen theme instead of flashing the wrong colour.

### 2. Gallery landing page

- `src/data/ifcModels.ts`
  - Extend `IfcModelOption` with `hidden?: boolean` and `thumbnailUrl: string`
    (`${import.meta.env.BASE_URL}thumbnails/<id>.png`).
  - Mark the sample model `hidden: true`; export `VISIBLE_IFC_MODELS`; derive `DEFAULT_IFC_MODEL_ID`
    from the visible list; add `findIfcModel(id)` helper.
- `src/components/IfcModelGallery.tsx` + `IfcModelGallery.css` (new)
  - Responsive card grid: thumbnail (`loading="lazy"`, `onError` → styled placeholder tile with the
    model initial), label, file name, file size, and a "Vis modell" call to action.
  - Each card is a `<Link>` to `/ifc-viewer/<id>` preserving the current `location.search` (the navbar
    already appends `?lang=`), plus a secondary "på GitHub" link.
  - Alpha/QA disclaimer banner at the top, plus title/intro reused from the existing translation keys.
- `src/pages/IfcViewerPage.tsx`
  - Read `useParams().modelId`. No id → render gallery. Unknown/hidden id → `<Navigate to="/ifc-viewer" replace />`.
    Valid id → `<IfcViewer modelId={modelId} />`.
- `src/App.tsx`: add `<Route path="/ifc-viewer/:modelId" element={<IfcViewerPage />} />` alongside the
  existing `/ifc-viewer` route.
- `IfcViewer` changes
  - Accept a required `modelId` prop; drop internal `selectedModelId` state.
  - Keep the toolbar `<select>` (populated from `VISIBLE_IFC_MODELS`); `onChange` calls
    `navigate(/ifc-viewer/<id> + location.search)`.
  - Add a "Tilbake til modelloversikt" back link above the title.
  - Show the disclaimer banner here too.

### 3. Thumbnail generation

- `IfcViewer` gains a hidden thumbnail mode triggered by `?thumbnail=1`:
  hides both side panels and the status pill, forces the light background and a fixed canvas size, and
  after `fitToView()` assigns `await renderer.captureScreenshot()` to `window.__ifcViewerThumbnail`.
- `snacks-app/scripts/generate-ifc-thumbnails.mjs` (new)
  - Adds `@playwright/test` as a devDependency and an npm script `thumbnails:generate`.
  - Parses model ids straight out of `src/data/ifcModels.ts` (regex over the `createRemoteModel(...)`
    calls) so the list never drifts from the gallery/dropdown, starts a temporary `vite` dev server on
    port 5175 (unless `--base-url` is given, e.g. to point at an already-running server or a
    `vite preview` build), launches Chromium with WebGPU flags (`--enable-unsafe-webgpu`,
    `--enable-features=Vulkan`), iterates the model ids, waits for `window.__ifcViewerThumbnail`, and
    writes `snacks-app/public/thumbnails/<id>.png`.
  - Supports `--base-url` and `--model <id>` flags.
  - **Runs headed by default**, not headless. Confirmed in this environment: headless Chromium's
    WebGPU/ANGLE backend never resolves `captureScreenshot()` (`page.waitForFunction` times out after
    60s) even though the same page works fine in a normal (headed) browser. Pass `--headless` to try
    the headless path anyway on a machine where it works.
- Generated PNGs are committed (they are site assets, not build output) and documented as a manual step.
  All 8 visible models were generated this way; sizes ranged ~15-30 KB each, well under the 100 KB budget.
- **Risk**: headless WebGPU can be unavailable on some machines/GPUs (confirmed above). Mitigation: the
  script defaults to headed mode, and the gallery already degrades to placeholder tiles if a thumbnail
  is missing.

### 4. Hierarchy grouping: Elementnavn vs IFC entity

- New `groupMode: 'elementName' | 'entity'` state, default `'elementName'`, persisted under
  `localStorage['snacks.ifcViewer.groupMode']`.
- Segmented control rendered directly above the hierarchy search field, labelled `Elementnavn` /
  `Ifc Entity` (matching the annotated screenshot).
- Element name resolution (`resolveElementName`): scan `extractPropertiesOnDemand(store, expressId)` for
  a property named exactly `BIM.05 - Elementnavn`; else the first property whose trimmed, lower-cased
  name ends with `elementnavn`; else `store.entities.getName(id)`; else the IFC type. Unresolved entities
  fall into a translated `Uten elementnavn` group.
- Resolution runs once per model load, after geometry is ready, in chunks (yielding to the event loop
  every ~50 entities) so the UI stays responsive; guarded by the existing `cancelled` flag and reported
  through the status line.
- `EntitySummary` gains `elementName: string`; `groupEntitiesByType` is generalised to
  `groupEntities(entities, mode)` keyed by `elementName` or `type`.
- Search matching includes `elementName`; `expandedTypes` keys become `${mode}::${groupKey}` (or are
  reset on mode change) so expansion state does not leak between modes.

### 5. Translations (`src/translations/translations.ts`, both `no` and `en`)

New keys: `ifcViewer.disclaimer`, `ifcViewer.background`, `ifcViewer.backgroundLight`,
`ifcViewer.backgroundDark`, `ifcViewer.groupBy`, `ifcViewer.groupByElementName`,
`ifcViewer.groupByEntity`, `ifcViewer.noElementName`, `ifcViewer.resolvingElementNames`,
`ifcViewer.galleryTitle`, `ifcViewer.galleryIntro`, `ifcViewer.galleryOpen`, `ifcViewer.galleryBack`,
`ifcViewer.galleryThumbnailAlt`, `ifcViewer.galleryMissingThumbnail`.

## Todos

1. `data-models` — extend `ifcModels.ts` with `hidden`, `thumbnailUrl`, `VISIBLE_IFC_MODELS`, `findIfcModel`.
2. `translations` — add the new `ifcViewer.*` keys to both languages.
3. `viewer-background` — add the persisted light/dark switch, `renderFrame` helper and themed CSS.
4. `hierarchy-grouping` — add Elementnavn resolution, the grouping toggle and search/expansion updates.
5. `viewer-props-route` — convert `IfcViewer` to a `modelId` prop, add back link and route-driven dropdown.
6. `gallery-component` — build `IfcModelGallery` + CSS with cards, placeholders and disclaimer.
7. `page-routing` — update `IfcViewerPage` and `App.tsx` for `/ifc-viewer/:modelId`.
8. `thumbnail-mode` — add the `?thumbnail=1` capture mode to `IfcViewer`.
9. `thumbnail-script` — add the Playwright script, npm script, devDependency and generated PNGs.
10. `plan-doc` — commit this plan to `plans/ifc-viewer-gallery-background-hierarchy.md`.
11. `validate` — `npm run lint`, `npm run build`, `npm test`, plus manual Playwright walkthrough of the
    gallery, a model view, the background switch and both grouping modes.

## Notes and considerations

- The viewer is WebGPU-only; the existing unsupported-browser messaging is preserved and the gallery
  (static PNGs) keeps working without WebGPU.
- `localStorage` access is wrapped in `try/catch` for privacy modes; defaults remain light + Elementnavn.
- Thumbnails must stay small (target ≤ 640×420, < ~100 KB each) so the gallery is cheap on GitHub Pages.
- All new user-facing strings go through `t(...)`; no hardcoded Norwegian/English in components.
- Paths use `import.meta.env.BASE_URL` to stay GitHub Pages compatible.
- Existing behaviour to preserve: panel resizing, picking/selection, property + quantity panels, the
  `ifcLite` credit line, and the per-model GitHub link.

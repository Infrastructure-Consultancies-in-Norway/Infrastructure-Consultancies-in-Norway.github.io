# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Layout

- The active React TypeScript application lives in `snacks-app/`.
- Static assets for the app are under `snacks-app/public/`.
- Source code is under `snacks-app/src/`, with reusable UI in `src/components/`, pages in `src/pages/`, shared data in `src/data/`, and translations in `src/translations/`.
- Root-level `Files/`, `Logos/`, `CNAME`, and `.nojekyll` support the GitHub Pages site and legacy/static assets.

## Common Commands

Run app commands from `snacks-app/`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
```

## Development Notes

- Keep changes focused and consistent with the existing React + TypeScript structure.
- Prefer small reusable components when UI behavior appears in more than one place.
- Preserve the bilingual language flow; update `src/translations/translations.ts` when visible text changes.
- Keep downloadable/static file paths compatible with GitHub Pages deployment.
- Do not commit build output or dependency folders.

## Language Support

- The app supports Norwegian (`no`) and English (`en`) through `src/contexts/LanguageContext.tsx`.
- Use `useLanguage()` and `t('translation.key')` for user-facing text instead of hardcoded strings.
- Add new visible text to both language objects in `src/translations/translations.ts`.
- Translation keys follow the existing grouped pattern, such as `nav.*`, `main.*`, `download.*`, `glossary.*`, and `contact.*`.
- Use `getImagePath()` for language-specific images so English variants like `(ENG)` are selected when available.

## Validation

Before handing off changes, run the narrowest relevant check. For source or UI changes, prefer:

```bash
cd snacks-app
npm run build
npm test
```

Use `npm run lint` when editing TypeScript/React source or shared configuration.
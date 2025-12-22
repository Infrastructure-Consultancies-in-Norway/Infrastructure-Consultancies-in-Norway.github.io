# Language Implementation Guide

## Overview
This document describes the implementation of English/Norwegian language switching in the SNACKS application.

## Features Implemented

### 1. Language Context (LanguageContext.tsx)
- **Location**: `src/contexts/LanguageContext.tsx`
- **Purpose**: Global state management for language selection
- **Features**:
  - Stores language preference in localStorage
  - Provides `t()` function for translations
  - Provides `getImagePath()` function for language-specific images
  - Supports 'no' (Norwegian) and 'en' (English) languages

### 2. Translations File (translations.ts)
- **Location**: `src/translations/translations.ts`
- **Structure**: Object with 'no' and 'en' keys, each containing translation strings
- **Coverage**: All user-facing text including:
  - Navigation menu items
  - Page titles and headings
  - Button labels
  - Descriptive text
  - Download item descriptions
  - Contact information

### 3. Language Toggle Button
- **Location**: Navbar component
- **Design**: Flag emoji + language code (🇬🇧 EN / 🇳🇴 NO)
- **Behavior**: 
  - Toggles between English and Norwegian
  - Saves preference to localStorage
  - Updates all text and images immediately

### 4. Image Handling
The `getImagePath()` function automatically switches between Norwegian and English images:

**Norwegian images** (default):
- `/Historie01.png`
- `/Spatial_Breakdown_System_01.png`
- `/Spatial_Breakdown_System_04.png`
- `/Objekt-navn01.png`
- `/Egenskapssett01.png`

**English images** (when English is selected):
- `/Historie01(ENG).png`
- `/Spatial_Breakdown_System_01(ENG).png`
- `/Spatial_Breakdown_System_04(ENG).png`
- `/Objekt-navn01(ENG).png`
- `/Egenskapssett01(ENG).png`

If an English version doesn't exist, the browser will show a broken image icon, but the app continues to function.

## Components Updated

All major components have been updated to use translations:

1. **Navbar.tsx** - Navigation menu and language toggle
2. **SideNavigation.tsx** - Side menu items
3. **SnacksMain.tsx** - Main page content
4. **StandardiseringDel1.tsx** - Standardization part 1
5. **StandardiseringDel2.tsx** - Standardization part 2
6. **Historie.tsx** - History section
7. **LastNed.tsx** - Download section
8. **Begrepsforklaring.tsx** - Glossary
9. **Tilleggsinformasjon.tsx** - Additional information
10. **Kontakt.tsx** - Contact page
11. **SnacksStrukturen.tsx** - SNACKS structure component

## Usage in Components

### Basic text translation:
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return <h1>{t('main.title')}</h1>;
};
```

### Image translation:
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { getImagePath } = useLanguage();
  
  return <img src={getImagePath('/Historie01.png')} alt="History" />;
};
```

### Get current language:
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { language } = useLanguage();
  
  return <div>Current language: {language}</div>;
};
```

## Adding New Translations

To add new translations:

1. Open `src/translations/translations.ts`
2. Add the key and value to both `no` and `en` objects:

```typescript
export const translations = {
  no: {
    'mykey': 'Min norske tekst',
    // ... other translations
  },
  en: {
    'mykey': 'My English text',
    // ... other translations
  }
};
```

3. Use in component: `{t('mykey')}`

## Translation Keys Structure

Translation keys follow a hierarchical naming convention:

- `nav.*` - Navigation items
- `main.*` - Main page content
- `std1.*` - Standardization part 1
- `std2.*` - Standardization part 2
- `history.*` - History section
- `download.*` - Download section
- `glossary.*` - Glossary
- `additional.*` - Additional information
- `contact.*` - Contact page

## Testing

1. Start the dev server: `npm run dev`
2. Open http://localhost:5173/
3. Click the language toggle button (🇬🇧 EN / 🇳🇴 NO) in the navbar
4. Verify:
   - All text changes to the selected language
   - Images with (ENG) versions display correctly when English is selected
   - Language preference persists after page refresh
   - All pages and sections display correctly in both languages

## Known Limitations

1. **Glossary terms**: The glossary definitions are not yet translated. This would require adding translations to `src/data/glossary.ts`
2. **Missing English images**: If an English version of an image doesn't exist, the browser will attempt to load it and fail gracefully
3. **External content**: YouTube video titles and embedded content are not translated

## Future Improvements

1. Add a fallback mechanism for missing English images to use Norwegian versions
2. Translate glossary term definitions
3. Add more languages if needed
4. Consider using a more robust i18n library like `react-i18next` for larger scale applications

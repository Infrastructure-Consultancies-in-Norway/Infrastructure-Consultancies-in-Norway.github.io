import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import type { UserConfig } from 'vitest/config'

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

export default defineConfig({
  plugins: [react()],
  base: '/',
  worker: {
    format: 'es',
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
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
} satisfies UserConfig)

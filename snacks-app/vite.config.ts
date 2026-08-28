import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
      'react-dom': fileURLToPath(new URL('./node_modules/react-dom', import.meta.url)),
      'react/jsx-runtime': fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url)),
      'react/jsx-dev-runtime': fileURLToPath(new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: false,
  },
  server: {
    fs: {
      strict: false,
    },
  },
})

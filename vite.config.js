import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // backend/ has its own vitest.config.js and its own test suite — keep
    // this project's test run scoped to the frontend so `npm test` here
    // never tries to load backend tests (and their Node-only deps).
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}']
  }
})

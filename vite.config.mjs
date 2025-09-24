import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This new line tells Vite to treat .riv files as assets
  assetsInclude: ['**/*.riv'], 
})
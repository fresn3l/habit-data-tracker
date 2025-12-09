import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'web',
    emptyOutDir: true,
    rollupOptions: {
      // Preserve eel.js script tag in HTML (not bundled, served by Eel at runtime)
      output: {
        // Don't modify HTML structure
      }
    }
  },
  // Ensure eel.js script is not processed by Vite
  optimizeDeps: {
    exclude: ['eel']
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // three.js ships as one lazy chunk (the point-cloud exhibit), fetched
  // only when the exhibit nears the viewport — its size is expected
  build: { chunkSizeWarningLimit: 900 },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})

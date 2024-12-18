import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://kerico-0548.github.io/rkpo",
  build: {
    outDir: "build"
  },
})

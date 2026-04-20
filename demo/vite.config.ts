import { defineConfig } from 'vite'

const root = new URL('.', import.meta.url).pathname.slice(0, -1)

export default defineConfig({
  root,
  resolve: {
    tsconfigPaths: true
  }
})

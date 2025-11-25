import { defineConfig } from 'tsdown'

// biome-ignore lint/style/noDefaultExport: it's fine
export default defineConfig({
  entry: ['./src/index.web.ts'],
  outDir: 'dist/web',
  format: 'esm',
  target: 'esnext',
})

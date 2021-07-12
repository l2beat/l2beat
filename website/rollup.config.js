import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/scripts/index.ts',
  output: {
    file: 'build/scripts/main.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [typescript({ module: 'ESNext' })],
})

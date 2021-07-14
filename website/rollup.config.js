import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  input: './src/scripts/index.ts',
  output: {
    file: 'build/scripts/main.js',
    format: 'iife',
  },
  plugins: [typescript({ module: 'ESNext' }), terser()],
})

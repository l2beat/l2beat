import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {},
  plugins: [],
}

// biome-ignore lint/style/noDefaultExport: config file
export default config

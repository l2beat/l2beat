const colors = require('./src/colors.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors,
    fontFamily: {
      sans: ['system-ui', 'sans-serif'],
      mono: [
        'ui-monospace',
        'Menlo',
        'Monaco',
        'Cascadia Code',
        'Source Code Pro',
        'Consolas',
        'DejaVu Sans Mono',
        'monospace',
      ],
      serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'serif'],
    },
  },
  plugins: [],
}

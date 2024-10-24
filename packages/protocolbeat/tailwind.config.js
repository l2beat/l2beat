/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['system-ui', 'sans-serif'],
        mono: [
          'ui-monospace',
          'Cascadia Code',
          'Source Code Pro',
          'Menlo',
          'Consolas',
          'DejaVu Sans Mono',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}

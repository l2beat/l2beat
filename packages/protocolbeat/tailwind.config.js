/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['system-ui', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
}

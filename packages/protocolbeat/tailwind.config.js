/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        milk: '#F0D8BD',
        cream: 'rgb(169 135 99)',
        coffee: 'rgb(29 23 21)',
        latte: 'rgb(89 76 67)',
        autumn: 'rgb(127 61 12)',
        sun: 'rgb(200 200 12)',
      },
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

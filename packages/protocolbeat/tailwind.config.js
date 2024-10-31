/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        milk: '#F0D8BD',
        cream: '#A98763',
        coffee: '#282422',
        latte: '#594C43',
        autumn: '#7f3D0C',
        sun: '#C8C80C',
      },
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
        serif: [
          'Charter',
          'Bitstream Charter',
          'Sitka Text',
          'Cambria',
          'serif',
        ],
      },
    },
  },
  plugins: [],
}

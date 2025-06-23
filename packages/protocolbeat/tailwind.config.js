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
    extend: {
      animation: {
        disco: 'disco 3s linear infinite',
        breath: 'breath 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        disco: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        breath: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

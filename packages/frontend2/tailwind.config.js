/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1s step-start infinite',
        pixelate: 'pixelate 10s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        pixelate: {
          '0%,100%': { backgroundColor: '#4b5563' },
          '50%': { backgroundColor: '#f97316' },
        },
      },
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
      serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'serif'],
    },
  },
  plugins: [],
}

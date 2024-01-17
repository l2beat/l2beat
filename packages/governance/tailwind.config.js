/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F9347B',
          secondary: '#222222',
          'secondary-dark': '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
}

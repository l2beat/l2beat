/** @type import("tailwindcss/types").Config */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        link: 'rgb(var(--link-rgb) / <alpha-value>)',
        white: '#fafafa',
        black: '#1b1b1b',
      },
    },
    screens: {
      xs: '400px',
      sm: '550px',
      md: '750px',
      lg: '1000px',
    },
  },
  plugins: [],
}

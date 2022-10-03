/** @type import("tailwindcss/types").Config */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
    colors: {
      current: 'currentColor',
      link: 'rgb(var(--link-rgb) / <alpha-value>)',
      white: '#fafafa',
      gray: {
        100: '#ededed',
        200: '#dfdfdf',
        800: '#424242',
        900: '#2f2f2f',
      },
      yellow: {
        100: '#fdcf44',
      },
      red: {
        100: '#ae2121',
      },
      black: '#1b1b1b',
      'bg-2': 'rgb(var(--bg-2) / <alpha-value>)',
      'bg-3': 'rgb(var(--bg-3) / <alpha-value>)',
      'bg-4': 'rgb(var(--bg-4) / <alpha-value>)',
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

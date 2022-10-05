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
      white: '#FAFAFA',
      gray: {
        100: '#EDEDED',
        200: '#DFDFDF',
        300: '#D3D3D3',
        700: '#565656',
        800: '#424242',
        900: '#2F2F2F',
      },
      black: '#1B1B1B',
      yellow: {
        100: '#FDCF44',
      },
      red: {
        100: '#AE2121',
      },
      pink: {
        100: '#DB8BF7',
        900: '#AB3BD2',
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

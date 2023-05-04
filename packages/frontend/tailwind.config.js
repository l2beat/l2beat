/** @type import("tailwindcss/types").Config */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx,md,css}'],
  darkMode: 'class',
  theme: {
    fontSize: {
      '3xs': ['8px', '12px'],
      '2xs': ['12px', '16px'],
      xs: ['14px', '20px'],
      sm: ['15px', '22px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '30px'],
      '2xl': ['24px', '36px'],
      '3xl': ['32px', '36px'],
      '4xl': ['40px', '60px'],
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      link: 'rgb(var(--link-rgb) / <alpha-value>)',
      white: '#FAFAFA',
      neutral: {
        700: '#323539',
      },
      zinc: {
        800: '#272A2F',
      },
      gray: {
        50: '#AEAEAE',
        100: '#EDEDED',
        200: '#DFDFDF',
        300: '#D3D3D3',
        400: '#D0CED1',
        500: '#737373',
        550: '#888888',
        600: '#848484',
        650: '#5C5C5C',
        700: '#565656',
        750: '#424850',
        800: '#424242',
        850: '#333333',
        900: '#2F2F2F',
        950: '#111111',
      },
      black: '#1B1B1B',
      yellow: {
        100: '#FFDD28',
        200: '#FFC107',
        300: '#FDCF44',
        500: '#E5C227',
        700: '#CB9800',
      },
      orange: { 500: '#FF7D1F', 600: '#F94A24' },
      purple: {
        100: '#7E41CC',
        300: '#F1D6FF',
        500: '#6A008E',
        700: '#4A133C',
        800: '#32102A',
      },
      pink: {
        100: '#FF46C0',
        200: '#DB8BF7',
        900: '#AB3BD2',
      },
      green: {
        200: '#B0FFAA',
        300: '#4EAB58',
        400: '#13E000',
        450: '#50E35F',
        500: '#5BFF4D',
        600: '#11CC00',
        700: '#007408',
        800: '#34762F',
      },
      red: {
        100: '#FDD9D9',
        200: '#EE2C01',
        300: '#FA3A3A',
        350: '#F94A24',
        400: '#FF0000',
        500: '#C32806',
        600: '#C71414',
        700: '#D70000',
        900: '#441111',
        950: '#323232',
      },
      blue: {
        300: '#CBDFF9',
        400: '#BADAFF',
        450: '#96C0F7',
        500: '#53A2FF',
        600: '#2B5CD9',
        700: '#005DD7',
        800: '#083575',
        900: '#112944',
      },
    },
    screens: {
      xs: '400px',
      sm: '550px',
      md: '750px',
      lg: '1000px',
    },
    zIndex: {
      1: '1',
      10: '10', // Chart logo and Y axis, Borders (TvlActivityToggle and DesktopTabs)
      20: '20', // Chart canvas and loader, Items (DesktopTabs, TvlActivityToggle)
      30: '30', // Chart hover line
      40: '40', // Milestones, Chart hover line point (squares and circles)
      50: '50', // Chart hover content
      60: '60', // Tooltip, Hoverable dropdown menu, Chart "Coming soon" disclaimer
      100: '100', // Mobile project navigation
      999: '999', // Mobile side menu
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      spacing: {
        '2/3': '66.666666%',
      },
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height',
      },
    },
  },
}

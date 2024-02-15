/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./src/**/*.{html,ts,tsx,md,css}'],
  darkMode: 'class',
  theme: {
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      pulse: {
        '0%': {
          transform: 'scale(1,1)',
        },
        '80%': {
          transform: 'scale(1, 1)',
        },
        '85%': {
          transform: 'scale(1.05, 1.05)',
        },
        '90%': {
          transform: 'scale(1, 1)',
        },
        '95%': {
          transform: 'scale(1.05, 1.05)',
        },
        '100%': {
          transform: 'scale(1, 1)',
        },
      },
    },
    animation: {
      'quick-fade-in': 'fade-in 0.1s ease-in-out',
      pulse: 'pulse 5s ease-in-out infinite forwards',
    },
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
      '5xl': ['48px', '60px'],
      '6xl': ['64px', '64px'],
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      brand: {
        red: '#F9347B',
        'red-dark': '#BD114F',
        black: '#222222',
      },
      'pure-white': '#FFFFFF',
      white: '#FAFAFA',
      neutral: {
        700: '#323539',
        900: '#131215',
      },
      zinc: {
        300: '#DBDBDB',
        500: '#5F6470',
        700: '#393C43',
        800: '#272A2F',
        900: '#1D1E22',
      },
      gray: {
        50: '#AEAEAE',
        100: '#EDEDED',
        200: '#DFDFDF',
        250: '#D4D4D4',
        300: '#D3D3D3',
        400: '#D0CED1',
        450: '#B9B9B9',
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
        250: '#FFEC44',
        300: '#FDCF44',
        500: '#E5C227',
        700: '#CB9800',
        800: '#382D11',
      },
      orange: { 400: '#FF8B36', 500: '#FF7D1F', 600: '#F94A24' },
      purple: {
        50: '#6C57BF',
        100: '#7E41CC',
        300: '#F1D6FF',
        500: '#6A008E',
        700: '#4A133C',
        800: '#32102A',
      },
      indigo: {
        500: '#7252F2',
      },
      pink: {
        100: '#FF46C0',
        200: '#DB8BF7',
        800: '#B94DDF',
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
        900: '#125D19',
      },
      red: {
        100: '#FDD9D9',
        200: '#EE2C01',
        300: '#FA3A3A',
        350: '#F94A24',
        400: '#FF0000',
        500: '#C32806',
        550: '#ED0000',
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
        550: '#1F87FF',
        600: '#2B5CD9',
        700: '#005DD7',
        800: '#083575',
        900: '#112944',
      },
      slate: {
        600: '#525C6A',
      },
      rose: {
        500: '#E33B4F',
        700: '#BB1B41',
      },
      teal: {
        400: '#2EC4B6',
        500: '#27AC9F',
      },
      sky: { 600: '#2083C1' },
    },
    screens: {
      xs: '400px',
      sm: '550px',
      md: '750px',
      lg: '1120px',
    },
    zIndex: {
      1: '1',
      10: '10', // Chart logo and Y axis, Borders (TvlActivityToggle and DesktopTabs)
      20: '20', // Chart canvas and loader, Items (DesktopTabs, TvlActivityToggle)
      25: '25',
      30: '30', // Chart hover line
      40: '40', // Milestones, Chart hover line point (squares and circles)
      50: '50', // Chart hover content
      60: '60', // Hoverable dropdown menu, Chart "Coming soon" disclaimer
      100: '100', // Mobile project navigation
      110: '110', // Tooltip
      999: '999', // Mobile side menu
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        'roboto-serif': ['Roboto Serif', 'Roboto', 'Arial'],
        lora: ['Lora', 'serif'],
      },
      spacing: {
        '2/3': '66.666666%',
      },
      opacity: {
        15: '0.15',
      },
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height',
      },
    },
  },
}

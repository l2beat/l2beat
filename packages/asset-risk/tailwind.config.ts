import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  theme: {
    fontSize: {
      '3xs': ['10px', '15px'],
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
      'pure-white': '#FFFFFF',
      white: '#FAFAFA',
      gray: {
        50: '#AEAEAE',
        100: '#E6E7EC',
        200: '#DFDFDF',
        400: '#D0CED1',
        500: '#737373',
      },
      brand: {
        red: '#F9347B',
        'red-dark': '#BD114F',
        black: '#222222',
      },
      blue: {
        700: '#005DD7',
      },
      neutral: {
        700: '#323539',
        800: '#222125',
        900: '#131215',
      },
      black: '#272A2F',
      red: {
        700: '#D70000',
      },
      pink: {
        200: '#DB8BF7',
        900: '#AB3BD2',
      },
      zinc: {
        300: '#D3D5D9',
        500: '#5F6470',
        700: '#393C43',
        900: '#1D1E22',
      },
      orange: { 600: '#F94A24' },
      yellow: {
        100: '#FFDD28',
      },
      green: {
        300: '#4EAB58',

        450: '#50E35F',
      },
    },
    screens: {
      xs: '400px',
      sm: '550px',
      md: '750px',
      lg: '1120px',
    },
    extend: {
      animation: {
        'quick-fade-in': 'fade-in 0.1s ease-in-out',
        'l2beat-pulse': 'l2beat-pulse 5s ease-in-out infinite forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'l2beat-pulse': {
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
      fontFamily: {
        sans: ['var(--font-roboto)', 'Roboto', 'Arial', 'sans-serif'],
        'roboto-serif': [
          'var(--font-roboto-serif)',
          'Roboto Serif',
          'Roboto',
          'Arial',
        ],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
// biome-ignore lint/style/noDefaultExport: this is a config file
export default config

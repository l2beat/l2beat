import containerQueries from '@tailwindcss/container-queries'
import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
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
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      'brand-red': '#F9347B',
      'brand-red-dark': '#BD114F',
      'brand-black': '#222222',
      'pure-white': '#FFFFFF',
      'pure-black': '#000000',
      white: '#FAFAFA',
      neutral: {
        700: '#323539',
        800: '#222125',
        900: '#131215',
      },
      zinc: {
        100: '#F3F3F3',
        300: '#DBDBDB',
        400: '#868B98',
        500: '#5F6470',
        700: '#393C43',
        800: '#272A2F',
        900: '#1D1E22',
      },
      'n-zinc': {
        300: '#D3D5D9',
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
        900: '#684E00',
      },
      'n-yellow': {
        700: '#AB8000',
      },
      orange: { 400: '#FF8B36', 500: '#FF7D1F', 600: '#F94A24' },
      purple: {
        50: '#6C57BF',
        100: '#7E41CC',
        300: '#F1D6FF',
        450: '#C164E3',
        500: '#6A008E',
        700: '#4A133C',
        800: '#32102A',
      },
      pink: {
        100: '#FF46C0',
        200: '#DB8BF7',
        800: '#B94DDF',
        900: '#AB3BD2',
      },
      'n-pink': {
        400: '#FC49C2',
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
        800: '#8D0A0A',
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
        900: '#112944',
        950: '#152A4B',
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
      sky: { 500: '#0074FD', 550: '#2670FF', 600: '#2083C1' },
      fuchsia: { 700: '#860CB0' },
      'n-cyan': {
        600: '#1C8BA4',
      },

      // New colors
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        invert: 'hsl(var(--primary-invert))',
      },
      secondary: 'hsl(var(--secondary))',
      positive: 'hsl(var(--positive))',
      warning: 'hsl(var(--warning))',
      negative: 'hsl(var(--negative))',
      brand: 'hsl(var(--brand))',
      background: 'hsl(var(--background))',
      'background-reading': 'hsl(var(--background-reading))',
      'surface-primary': 'hsl(var(--surface-primary))',
      'surface-secondary': 'hsl(var(--surface-secondary))',
      'surface-tertiary': 'hsl(var(--surface-tertiary))',
      'header-secondary': 'hsl(var(--header-secondary))',
      'header-primary': 'hsl(var(--header-primary))',
      'icon-secondary': 'hsl(var(--icon-secondary))',
      overlay: 'hsl(var(--overlay))',
      divider: 'hsl(var(--divider))',
      link: 'hsl(var(--link))',
      'link-stroke': 'hsl(var(--link-stroke))',
      'chart-ethereum': 'hsl(var(--chart-ethereum))',
    },
    screens: {
      xs: '400px',
      sm: '550px',
      md: '768px',
      lg: '1200px',
      xl: '1920px',
    },
    zIndex: {
      1: '1',
      10: '10', // Chart logo and Y axis, Borders (TvsActivityToggle and DesktopTabs)
      20: '20', // Chart canvas and loader, Items (DesktopTabs, TvsActivityToggle)
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
      boxShadow: {
        popover: '0px 4px 12px 0px rgba(0, 0, 0, 0.55)',
      },
      keyframes: {
        beat: {
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
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0', opacity: '0%' },
          to: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '100%',
          },
        },
        'collapsible-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '100%',
          },
          to: { height: '0', opacity: '0%' },
        },
      },
      animation: {
        beat: 'beat 5s ease-in-out infinite forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.3s ease-out',
        'collapsible-up': 'collapsible-up 0.3s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'Roboto', 'Arial', 'sans-serif'],
        'roboto-serif': [
          'var(--font-roboto-serif)',
          'Roboto Serif',
          'Roboto',
          'Arial',
        ],
        'roboto-serif-ext': [
          'var(--font-roboto-serif-ext)',
          'var(--font-roboto-serif)',
          'Roboto Serif',
          'Roboto',
          'Arial',
        ],
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
  plugins: [
    plugin((creator) => {
      creator.addVariant('primary-card', '.primary-card &')
      creator.addUtilities({ '.primary-card': {} })
    }),
    tailwindcssAnimate,
    containerQueries,
  ],
}

// biome-ignore lint/style/noDefaultExport: config file
export default config

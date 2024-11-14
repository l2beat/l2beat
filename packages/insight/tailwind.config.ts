import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      xs: '400px',
      sm: '550px',
      md: '768px',
      lg: '1200px',
      xl: '1920px',
    },
    fontFamily: {
      inter: ['var(--font-inter)', 'Inter', 'Arial', 'sans-serif'],
      oswald: [
        'var(--font-oswald)',
        'Oswald',
        'var(--font-inter)',
        'Inter',
        'Arial',
        'sans-serif',
      ],
    },
    colors: {
      background: 'var(--background)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      surface: {
        primary: 'var(--surface-primary)',
        secondary: 'var(--surface-secondary)',
        tertiary: 'var(--surface-tertiary)',
      },
      highlight: 'var(--highlight)',
      'highlight-secondary': 'var(--highlight-secondary)',
      divider: 'var(--divider)',
      white: '#FFFFFF',
      'off-white': '#FAFAFA',
      black: '#1B1B1B',
      blue: {
        500: '#53A2FF',
        550: '#1F87FF',
        700: '#005DD7',
      },
      red: {
        300: '#FA3A3A',
        600: '#C71414',
        700: '#D70000',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config

import type { Config } from 'tailwindcss'

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
    extend: {},
  },
  plugins: [],
}

export default config

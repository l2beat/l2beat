import { content, plugin } from 'flowbite-react/tailwind'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    content(),
  ],
  theme: {
    colors: {
      'brand-red': '#F9347B',
      'brand-red-dark': '#BD114F',
      'brand-black': '#222222',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [plugin()],
  safelist: [
    {
      pattern: /pl-.+/,
      variants: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  ],
}

export default config

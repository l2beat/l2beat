import localFont from 'next/font/local'

export const roboto = localFont({
  src: [
    {
      path: './roboto-v32-latin-100.woff2',
      weight: '100',
    },
    {
      path: './roboto-v32-latin-300.woff2',
      weight: '300',
    },
    {
      path: './roboto-v32-latin-400.woff2',
      weight: '400',
    },
    {
      path: './roboto-v32-latin-500.woff2',
      weight: '500',
    },
    {
      path: './roboto-v32-latin-700.woff2',
      weight: '700',
    },
    {
      path: './roboto-v32-latin-900.woff2',
      weight: '900',
    },
  ],
  variable: '--font-roboto',
})

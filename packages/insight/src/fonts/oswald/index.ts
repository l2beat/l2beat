import localFont from 'next/font/local'

export const oswald = localFont({
  src: [
    {
      path: './oswald-v53-latin-200.woff2',
      weight: '200',
    },
    {
      path: './oswald-v53-latin-300.woff2',
      weight: '300',
    },
    {
      path: './oswald-v53-latin-400.woff2',
      weight: '400',
    },
    {
      path: './oswald-v53-latin-500.woff2',
      weight: '500',
    },
    {
      path: './oswald-v53-latin-600.woff2',
      weight: '600',
    },
    {
      path: './oswald-v53-latin-700.woff2',
      weight: '700',
    },
  ],
  variable: '--font-oswald',
})

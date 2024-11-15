import localFont from 'next/font/local'

export const roboto_serif = localFont({
  src: [
    {
      path: './roboto-serif-v13-latin-100.woff2',
      weight: '100',
    },
    {
      path: './roboto-serif-v13-latin-200.woff2',
      weight: '200',
    },
    {
      path: './roboto-serif-v13-latin-300.woff2',
      weight: '300',
    },
    {
      path: './roboto-serif-v13-latin-400.woff2',
      weight: '400',
    },
    {
      path: './roboto-serif-v13-latin-500.woff2',
      weight: '500',
    },
    {
      path: './roboto-serif-v13-latin-600.woff2',
      weight: '600',
    },
    {
      path: './roboto-serif-v13-latin-700.woff2',
      weight: '700',
    },
    {
      path: './roboto-serif-v13-latin-800.woff2',
      weight: '800',
    },
    {
      path: './roboto-serif-v13-latin-900.woff2',
      weight: '900',
    },
  ],
  variable: '--font-roboto-serif',
})

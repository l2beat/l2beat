import localFont from 'next/font/local'

export const inter = localFont({
  src: [
    {
      path: './inter-v18-latin-100.woff2',
      weight: '100',
    },

    {
      path: './inter-v18-latin-200.woff2',
      weight: '200',
    },
    {
      path: './inter-v18-latin-300.woff2',
      weight: '300',
    },
    {
      path: './inter-v18-latin-400.woff2',
      weight: '400',
    },
    {
      path: './inter-v18-latin-500.woff2',
      weight: '500',
    },
    {
      path: './inter-v18-latin-600.woff2',
      weight: '600',
    },
    {
      path: './inter-v18-latin-700.woff2',
      weight: '700',
    },
    {
      path: './inter-v18-latin-800.woff2',
      weight: '800',
    },
    {
      path: './inter-v18-latin-900.woff2',
      weight: '900',
    },
  ],
  variable: '--font-inter',
})

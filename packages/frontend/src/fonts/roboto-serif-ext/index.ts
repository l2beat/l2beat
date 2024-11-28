import localFont from 'next/font/local'

export const roboto_serif_ext = localFont({
  src: [
    {
      path: './roboto-serif-v15-latin_latin-ext-100.woff2',
      weight: '100',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-200.woff2',
      weight: '200',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-300.woff2',
      weight: '300',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-400.woff2',
      weight: '400',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-500.woff2',
      weight: '500',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-600.woff2',
      weight: '600',
    },
    {
      path: './roboto-serif-v15-latin_latin-ext-700.woff2',
      weight: '700',
    },
  ],
  variable: '--font-roboto-serif-ext',
})

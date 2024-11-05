import localFont from 'next/font/local'

export const roboto = localFont({
  src: [
    {
      path: './roboto/roboto-v32-latin-100.woff2',
      weight: '100',
    },
    {
      path: './roboto/roboto-v32-latin-300.woff2',
      weight: '300',
    },
    {
      path: './roboto/roboto-v32-latin-400.woff2',
      weight: '400',
    },
    {
      path: './roboto/roboto-v32-latin-500.woff2',
      weight: '500',
    },
    {
      path: './roboto/roboto-v32-latin-700.woff2',
      weight: '700',
    },
    {
      path: './roboto/roboto-v32-latin-900.woff2',
      weight: '900',
    },
  ],
  variable: '--font-roboto',
})

export const roboto_serif = localFont({
  src: [
    {
      path: './roboto-serif/roboto-serif-v13-latin-100.woff2',
      weight: '100',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-200.woff2',
      weight: '200',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-300.woff2',
      weight: '300',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-400.woff2',
      weight: '400',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-500.woff2',
      weight: '500',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-600.woff2',
      weight: '600',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-700.woff2',
      weight: '700',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-800.woff2',
      weight: '800',
    },
    {
      path: './roboto-serif/roboto-serif-v13-latin-900.woff2',
      weight: '900',
    },
  ],
  variable: '--font-roboto-serif',
})

export const roboto_serif_ext = localFont({
  src: [
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-100.woff2',
      weight: '100',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-200.woff2',
      weight: '200',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-300.woff2',
      weight: '300',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-400.woff2',
      weight: '400',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-500.woff2',
      weight: '500',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-600.woff2',
      weight: '600',
    },
    {
      path: './roboto-serif-ext/roboto-serif-v15-latin_latin-ext-700.woff2',
      weight: '700',
    },
  ],
  variable: '--font-roboto-serif-ext',
})

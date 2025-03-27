export interface FontInfo {
  name: string
  src: { path: string; weight: string }[]
}

export const fonts: FontInfo[] = [
  {
    name: 'Roboto',
    src: [
      {
        path: '/static/fonts/roboto/roboto-v32-latin-100.woff2',
        weight: '100',
      },
      {
        path: '/static/fonts/roboto/roboto-v32-latin-300.woff2',
        weight: '300',
      },
      {
        path: '/static/fonts/roboto/roboto-v32-latin-400.woff2',
        weight: '400',
      },
      {
        path: '/static/fonts/roboto/roboto-v32-latin-500.woff2',
        weight: '500',
      },
      {
        path: '/static/fonts/roboto/roboto-v32-latin-700.woff2',
        weight: '700',
      },
      {
        path: '/static/fonts/roboto/roboto-v32-latin-900.woff2',
        weight: '900',
      },
    ],
  },
  {
    name: 'Roboto Serif',
    src: [
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-100.woff2',
        weight: '100',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-200.woff2',
        weight: '200',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-300.woff2',
        weight: '300',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-400.woff2',
        weight: '400',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-500.woff2',
        weight: '500',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-600.woff2',
        weight: '600',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-700.woff2',
        weight: '700',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-800.woff2',
        weight: '800',
      },
      {
        path: '/static/fonts/roboto-serif/roboto-serif-v13-latin-900.woff2',
        weight: '900',
      },
    ],
  },
  {
    name: 'Roboto Serif Ext',
    src: [
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-100.woff2',
        weight: '100',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-200.woff2',
        weight: '200',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-300.woff2',
        weight: '300',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-400.woff2',
        weight: '400',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-500.woff2',
        weight: '500',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-600.woff2',
        weight: '600',
      },
      {
        path: '/static/fonts/roboto-serif-ext/roboto-serif-v15-latin_latin-ext-700.woff2',
        weight: '700',
      },
    ],
  },
]

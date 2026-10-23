export interface FontInfo {
  name: string
  src: {
    path: string
    weight: string
    style?: 'normal' | 'italic'
    unicodeRange?: string
    preload?: boolean
  }[]
}

// Google Fonts' subset ranges, so a page downloads latin-ext only if it uses it.
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF'

export const fonts: FontInfo[] = [
  {
    name: 'Roboto',
    src: [
      {
        path: '/fonts/roboto/roboto-v48-latin-100.woff2',
        weight: '100',
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-200.woff2',
        weight: '200',
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-300.woff2',
        weight: '300',
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-400.woff2',
        weight: '400',
        preload: true,
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-500.woff2',
        weight: '500',
        preload: true,
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-600.woff2',
        weight: '600',
        preload: true,
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-700.woff2',
        weight: '700',
        preload: true,
      },
      {
        path: '/fonts/roboto/roboto-v48-latin-900.woff2',
        weight: '900',
      },
    ],
  },
  {
    // Variable font: one file holds every weight and optical size, so titles
    // get the display cut and body text the text cut.
    name: 'Inter',
    src: [
      {
        path: '/fonts/inter/inter-v20-latin-normal.woff2',
        weight: '100 900',
        unicodeRange: LATIN,
      },
      {
        path: '/fonts/inter/inter-v20-latin-ext-normal.woff2',
        weight: '100 900',
        unicodeRange: LATIN_EXT,
      },
      {
        path: '/fonts/inter/inter-v20-latin-italic.woff2',
        weight: '100 900',
        style: 'italic',
        unicodeRange: LATIN,
      },
      {
        path: '/fonts/inter/inter-v20-latin-ext-italic.woff2',
        weight: '100 900',
        style: 'italic',
        unicodeRange: LATIN_EXT,
      },
    ],
  },
]

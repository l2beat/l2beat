import { Roboto, Roboto_Serif } from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
})

export const roboto_serif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto-serif',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

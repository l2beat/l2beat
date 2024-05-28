import './globals.css'

import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Roboto, Roboto_Serif } from 'next/font/google'

import { ReactQueryProvider } from '~/components/ReactQueryProvider'
import { Web3Provider } from '~/components/Web3Provider'
import { cn } from '~/utils/cn'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
})

const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto-serif',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['italic', 'normal'],
})

export const metadata: Metadata = {
  title: 'L2BEAT – Asset Risk Prototype',
  description: 'Get your asset risk report for your L2 assets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // We suppress the hydration warning because we're using the ThemeProvider,
    // which causes a mismatch between the server and client render.
    // This is completely fine and applies to the `html` tag only.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="mask-icon" href="/mask-icon.svg" />
      </head>
      <body
        className={cn(roboto.variable, robotoSerif.variable, 'flex flex-col')}
      >
        <ReactQueryProvider>
          <Web3Provider>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
          </Web3Provider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

import { VercelToolbar } from '@vercel/toolbar/next'
import { type Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'next-themes'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'
import { restoreCollapsibleNavStateScript } from './_components/nav/consts'

import '../styles/globals.css'
import { HtmlPathnameSetter } from './_components/html-pathname-setter'
import { TooltipProvider } from './_components/tooltip'
import { roboto } from './fonts'

export const metadata: Metadata = {
  title: 'L2BEAT - The state of the layer two ecosystem',
  description:
    'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
  icons: [
    { rel: 'icon', url: '/favicon.svg' },
    { rel: 'shortcut icon', url: '/favicon.png' },
    { rel: 'apple-touch-icon', url: '/favicon.png' },
    { rel: 'mask-icon', url: '/mask-icon.svg' },
  ],
  metadataBase: new URL('https://l2beat.com'),
  openGraph: {
    type: 'website',
    siteName: 'L2BEAT',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development'

  return (
    // We suppress the hydration warning here because we're using:
    // - next-themes's ThemeProvider
    // - our restoreCollapsibleNavStateScript
    // which cause a mismatch between the server and client render.
    // This is completely fine and applies to the `html` tag only.
    <html lang="en-us" suppressHydrationWarning>
      <body className={roboto.variable}>
        <script {...restoreCollapsibleNavStateScript} />
        <PlausibleProvider
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          enabled={env.NEXT_PUBLIC_PLAUSIBLE_ENABLED}
        >
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              storageKey="l2beat-theme"
              disableTransitionOnChange
            >
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
        <HtmlPathnameSetter />
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}

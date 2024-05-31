import { VercelToolbar } from '@vercel/toolbar/next'
import { type Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'next-themes'
import { Roboto } from 'next/font/google'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'
import { restoreCollapsibleNavStateScript } from './_components/nav/consts'

import '../styles/globals.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })
// NOTE(piotradamczyk): Not configuring Roboto Sans here as it's only used
// on government pages and thus should be loaded in some other layout
// after we migrate them.

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
  const locale = await getLocale()
  const shouldInjectToolbar = process.env.NODE_ENV === 'development'

  return (
    // We suppress the hydration warning here because we're using:
    // - next-themes's ThemeProvider
    // - our restoreCollapsibleNavStateScript
    // which cause a mismatch between the server and client render.
    // This is completely fine and applies to the `html` tag only.
    <html
      lang={locale}
      className="scroll-pt-16 scroll-smooth md:scroll-pt-8"
      suppressHydrationWarning
    >
      <body className={roboto.className}>
        <script {...restoreCollapsibleNavStateScript} />
        <PlausibleProvider
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          enabled={env.NEXT_PUBLIC_PLAUSIBLE_ENABLED}
        >
          <TRPCReactProvider>
            <ThemeProvider attribute="class" storageKey="l2beat-theme">
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import PlausibleProvider from 'next-plausible'
import { Roboto } from 'next/font/google'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'
import './globals.css'

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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <PlausibleProvider
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          enabled={env.NEXT_PUBLIC_PLAUSIBLE_ENABLED}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}

import { type Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'next-themes'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'
import { restoreCollapsibleNavStateScript } from './_components/nav/consts'

import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import { roboto } from '../fonts'
import '../styles/globals.css'
import { GlossaryContextProvider } from './_components/markdown/glossary-context'
import { TooltipProvider } from './_components/tooltip/tooltip'

export const metadata: Metadata = getDefaultMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const terms = getCollection('glossary')

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
              <TooltipProvider delayDuration={300}>
                <GlossaryContextProvider
                  terms={terms.map((term) => ({
                    id: term.id,
                    matches: [term.data.term, ...(term.data.match ?? [])],
                  }))}
                >
                  {children}
                </GlossaryContextProvider>
              </TooltipProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}

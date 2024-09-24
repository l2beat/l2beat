import { type Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider } from 'next-themes'

import { getCollection } from '~/content/get-collection'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'
import { getDefaultMetadata } from '~/utils/metadata'
import { TooltipProvider } from '../components/core/tooltip/tooltip'
import { GlossaryContextProvider } from '../components/markdown/glossary-context'
import { ProgressBar } from '../components/progress-bar'
import { roboto } from '../fonts'
import '../styles/globals.css'

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
      <head>
        {/* The rest of the icons are handled by the App Router */}
        <link rel="mask-icon" href="/mask-icon.svg" />
      </head>
      <body className={roboto.variable}>
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
                  <ProgressBar />
                </GlossaryContextProvider>
              </TooltipProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}

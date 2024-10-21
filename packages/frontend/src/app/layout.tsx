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
import { bridges, daLayers, layer2s, layer3s } from '@l2beat/config'
import { SearchBarContextProvider } from '~/components/search-bar/search-bar-context'
import { toSearchBarProject } from '~/components/search-bar/to-search-bar-project'

export const metadata: Metadata = getDefaultMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const terms = getCollection('glossary')

  const recentlyAdded = [...layer2s, ...layer3s]
    .filter((p) => p.isUpcoming)
    .sort(
      (a, b) => (b.createdAt?.toNumber() ?? 0) - (a.createdAt?.toNumber() ?? 0),
    )
    .slice(0, 15)
    .map(toSearchBarProject)

  const allProjects = [
    ...layer2s,
    ...layer3s,
    ...bridges,
    ...(env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT ? daLayers : []),
  ].map(toSearchBarProject)
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
        {/* Prevent zooming on input click on iOS by adding maximum-scale=1 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
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
              <TooltipProvider delayDuration={300} disableHoverableContent>
                <GlossaryContextProvider
                  terms={terms.map((term) => ({
                    id: term.id,
                    matches: [term.data.term, ...(term.data.match ?? [])],
                  }))}
                >
                  <SearchBarContextProvider
                    recentlyAdded={recentlyAdded}
                    allProjects={allProjects}
                  >
                    {children}
                  </SearchBarContextProvider>
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

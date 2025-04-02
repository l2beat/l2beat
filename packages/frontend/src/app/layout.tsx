import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { SearchBarContextProvider } from '~/components/search-bar/search-bar-context'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { PlausibleProvider } from '~/providers/plausible-provider'
import { TRPCReactProvider } from '~/trpc/react'
import { getDefaultMetadata } from '~/utils/metadata'
import { TooltipProvider } from '../components/core/tooltip/tooltip'
import { GlossaryContextProvider } from '../components/markdown/glossary-context'
import { ProgressBar } from '../components/progress-bar'
import { roboto } from '../fonts'
import '../styles/globals.css'
import { RecategorisationPreviewContextProvider } from '~/components/recategorisation-preview/recategorisation-preview-provider'

export const metadata: Metadata = getDefaultMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const terms = getCollection('glossary')
  const searchBarProjects = await getSearchBarProjects()

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
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            storageKey="l2beat-theme"
            disableTransitionOnChange
          >
            <PlausibleProvider>
              <TooltipProvider delayDuration={300} disableHoverableContent>
                <GlossaryContextProvider
                  terms={terms.map((term) => ({
                    id: term.id,
                    matches: [term.data.term, ...(term.data.match ?? [])],
                  }))}
                >
                  <SearchBarContextProvider projects={searchBarProjects}>
                    <RecategorisationPreviewContextProvider>
                      {children}
                    </RecategorisationPreviewContextProvider>
                  </SearchBarContextProvider>
                  <ProgressBar />
                </GlossaryContextProvider>
              </TooltipProvider>
            </PlausibleProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

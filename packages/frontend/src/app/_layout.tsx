import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '~/components/core/tooltip/tooltip'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import { GlossaryContextProvider } from '~/components/markdown/glossary-context'
import { ProgressBar } from '~/components/progress-bar'
import { RecategorisationPreviewContextProvider } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { SearchBarContextProvider } from '~/components/search-bar/search-bar-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'

export function AppLayout({
  children,
  terms,
  searchBarProjects,
}: {
  children: React.ReactNode
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="l2beat-theme"
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={300} disableHoverableContent>
        <GlossaryContextProvider terms={terms}>
          <SearchBarContextProvider projects={searchBarProjects}>
            <RecategorisationPreviewContextProvider>
              {children}
            </RecategorisationPreviewContextProvider>
          </SearchBarContextProvider>
          <ProgressBar />
        </GlossaryContextProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

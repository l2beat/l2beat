import { ThemeProvider } from 'next-themes'
import { DevAutoReloader } from '~/components/DevAutoReloader'
import { TooltipProvider } from '~/components/core/tooltip/tooltip'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import { GlossaryContextProvider } from '~/components/markdown/glossary-context'
import { RecategorisationPreviewContextProvider } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { SearchBarContextProvider } from '~/components/search-bar/search-bar-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/react'

export interface AppLayoutProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
  defaultRecategorisationPreviewChecked?: boolean
}

export function AppLayout({
  children,
  terms,
  searchBarProjects,
  defaultRecategorisationPreviewChecked,
}: AppLayoutProps & {
  children: React.ReactNode
}) {
  return (
    <TRPCReactProvider>
      {env.NODE_ENV !== 'production' && <DevAutoReloader />}
      <ThemeProvider
        attribute="class"
        storageKey="l2beat-theme"
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={300} disableHoverableContent>
          <GlossaryContextProvider terms={terms}>
            <SearchBarContextProvider projects={searchBarProjects}>
              <RecategorisationPreviewContextProvider
                defaultChecked={defaultRecategorisationPreviewChecked}
              >
                {children}
              </RecategorisationPreviewContextProvider>
            </SearchBarContextProvider>
          </GlossaryContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { DevAutoReloader } from '~/components/DevAutoReloader'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/GlossaryContext'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import type { SearchBarProject } from '~/components/search-bar/SearchBarEntry'
import { env } from '~/env'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}

export function AppLayout({
  children,
  terms,
  searchBarProjects,
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
              {children}
            </SearchBarContextProvider>
          </GlossaryContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

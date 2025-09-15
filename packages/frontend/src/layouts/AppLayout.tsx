import { ThemeProvider } from 'next-themes'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { DevAutoReloader } from '~/components/DevAutoReloader'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import { env } from '~/env'
import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  terms: GlossaryTerm[]
  recentlyAddedProjects: SearchBarProject[]
}

export function AppLayout({
  children,
  terms,
  recentlyAddedProjects,
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
            <SearchBarContextProvider
              recentlyAddedProjects={recentlyAddedProjects}
            >
              <ChartLegendOnboardingProvider>
                {children}
              </ChartLegendOnboardingProvider>
            </SearchBarContextProvider>
          </GlossaryContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

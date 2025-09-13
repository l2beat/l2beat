import { ThemeProvider } from 'next-themes'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { DevAutoReloader } from '~/components/DevAutoReloader'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import { WhatsNewContextProvider } from '~/components/whats-new/WhatsNewContext'
import type { WhatsNewWidget } from '~/components/whats-new/WhatsNewWidget'
import { env } from '~/env'
import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  terms: GlossaryTerm[]
  recentlyAddedProjects: SearchBarProject[]
  whatsNew: WhatsNewWidget | undefined
}

export function AppLayout({
  children,
  terms,
  recentlyAddedProjects,
  whatsNew,
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
            <WhatsNewContextProvider whatsNew={whatsNew}>
              <SearchBarContextProvider
                recentlyAddedProjects={recentlyAddedProjects}
              >
                <ChartLegendOnboardingProvider>
                  {children}
                </ChartLegendOnboardingProvider>
              </SearchBarContextProvider>
            </WhatsNewContextProvider>
          </GlossaryContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

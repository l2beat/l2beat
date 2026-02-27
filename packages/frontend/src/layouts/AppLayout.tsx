import type { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { ThemeProvider } from 'next-themes'
import { CountdownsContextProvider } from '~/components/CountdownsContext'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { L2BeatDevTools } from '~/components/dev-tools/L2BeatDevTools'
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
  countdowns: typeof PROJECT_COUNTDOWNS
}

export function AppLayout({
  children,
  terms,
  recentlyAddedProjects,
  whatsNew,
  countdowns,
}: AppLayoutProps & {
  children: React.ReactNode
}) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        storageKey="l2beat-theme"
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={300} disableHoverableContent>
          {env.NODE_ENV === 'development' && <L2BeatDevTools />}
          <CountdownsContextProvider countdowns={countdowns}>
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
          </CountdownsContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

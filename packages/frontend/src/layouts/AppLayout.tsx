import type { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { ThemeProvider } from 'next-themes'
import { CountdownsContextProvider } from '~/components/CountdownsContext'
import { ChangelogEntriesContextProvider } from '~/components/changelog/ChangelogEntriesContext'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { L2BeatDevTools } from '~/components/dev-tools/L2BeatDevTools'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import {
  type BadgeDictionary,
  BadgeDictionaryContextProvider,
} from '~/components/projects/BadgeDictionaryContext'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import { WhatsNewContextProvider } from '~/components/whats-new/WhatsNewContext'
import type { WhatsNewWidget } from '~/components/whats-new/WhatsNewWidget'
import { env } from '~/env'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  terms: GlossaryTerm[]
  recentlyAddedProjects: SearchBarProject[]
  recentChangelogEntriesIds: string[]
  whatsNew: WhatsNewWidget | undefined
  countdowns: typeof PROJECT_COUNTDOWNS
  // Only pages listing scaling projects need it; see getReferencedBadges
  badges?: BadgeDictionary
}

export function AppLayout({
  children,
  terms,
  recentlyAddedProjects,
  recentChangelogEntriesIds,
  whatsNew,
  countdowns,
  badges = {},
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
              <ChangelogEntriesContextProvider
                recentChangelogEntriesIds={recentChangelogEntriesIds}
              >
                <WhatsNewContextProvider whatsNew={whatsNew}>
                  <SearchBarContextProvider
                    recentlyAddedProjects={recentlyAddedProjects}
                  >
                    <BadgeDictionaryContextProvider badges={badges}>
                      <ChartLegendOnboardingProvider>
                        {children}
                      </ChartLegendOnboardingProvider>
                    </BadgeDictionaryContextProvider>
                  </SearchBarContextProvider>
                </WhatsNewContextProvider>
              </ChangelogEntriesContextProvider>
            </GlossaryContextProvider>
          </CountdownsContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

import { ThemeProvider } from 'next-themes'
import { ChangelogEntriesContextProvider } from '~/components/changelog/ChangelogEntriesContext'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { DevAutoReloader } from '~/components/DevAutoReloader'
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
  recentChangelogEntriesIds: string[]
  whatsNew: WhatsNewWidget | undefined
}

export function AppLayout({
  children,
  terms,
  recentlyAddedProjects,
  recentChangelogEntriesIds,
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
          {env.NODE_ENV === 'development' && <L2BeatDevTools />}
          <GlossaryContextProvider terms={terms}>
            <ChangelogEntriesContextProvider
              recentChangelogEntriesIds={recentChangelogEntriesIds}
            >
              <WhatsNewContextProvider whatsNew={whatsNew}>
                <SearchBarContextProvider
                  recentlyAddedProjects={recentlyAddedProjects}
                >
                  <ChartLegendOnboardingProvider>
                    {children}
                  </ChartLegendOnboardingProvider>
                </SearchBarContextProvider>
              </WhatsNewContextProvider>
            </ChangelogEntriesContextProvider>
          </GlossaryContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

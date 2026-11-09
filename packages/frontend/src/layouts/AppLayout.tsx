import type { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { CountdownsContextProvider } from '~/components/CountdownsContext'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { L2BeatDevTools } from '~/components/dev-tools/L2BeatDevTools'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import {
  type WhatsNewItem,
  WhatsNewItemProvider,
} from '~/components/whats-new/WhatsNewItemContext'
import { env } from '~/env'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  recentlyAddedProjects: SearchBarProject[]
  /** The announcement at the end of the nav. */
  whatsNewItem: WhatsNewItem | undefined
  countdowns: typeof PROJECT_COUNTDOWNS
}

export function AppLayout({
  children,
  recentlyAddedProjects,
  whatsNewItem,
  countdowns,
}: AppLayoutProps & {
  children: React.ReactNode
}) {
  return (
    <TRPCReactProvider>
      <TooltipProvider delayDuration={300} disableHoverableContent>
        {/* The static check lets bundlers drop the dev tools from production builds */}
        {process.env.NODE_ENV !== 'production' &&
          env.NODE_ENV === 'development' && <L2BeatDevTools />}
        <CountdownsContextProvider countdowns={countdowns}>
          <WhatsNewItemProvider item={whatsNewItem}>
            <SearchBarContextProvider
              recentlyAddedProjects={recentlyAddedProjects}
            >
              <ChartLegendOnboardingProvider>
                {children}
              </ChartLegendOnboardingProvider>
            </SearchBarContextProvider>
          </WhatsNewItemProvider>
        </CountdownsContextProvider>
      </TooltipProvider>
    </TRPCReactProvider>
  )
}

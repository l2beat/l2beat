import type { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { CountdownsContextProvider } from '~/components/CountdownsContext'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { L2BeatDevTools } from '~/components/dev-tools/L2BeatDevTools'
import { SearchBarContextProvider } from '~/components/search-bar/SearchBarContext'
import { WhatsNewContextProvider } from '~/components/whats-new/WhatsNewContext'
import {
  type WhatsNewItem,
  WhatsNewItemProvider,
} from '~/components/whats-new/WhatsNewItemContext'
import type { WhatsNewWidget } from '~/components/whats-new/WhatsNewWidget'
import { env } from '~/env'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { TRPCReactProvider } from '~/trpc/React'

export interface AppLayoutProps {
  recentlyAddedProjects: SearchBarProject[]
  whatsNew: WhatsNewWidget | undefined
  /** The announcement at the end of the nav. */
  whatsNewItem: WhatsNewItem | undefined
  countdowns: typeof PROJECT_COUNTDOWNS
}

export function AppLayout({
  children,
  recentlyAddedProjects,
  whatsNew,
  whatsNewItem,
  countdowns,
}: AppLayoutProps & {
  children: React.ReactNode
}) {
  return (
    <TRPCReactProvider>
      {/* The delay counts from when the cursor stops, so it can be short. It
          stays long enough that drifting down a table column does not open
          every row's tooltip, which the warm group would then chain. */}
      <TooltipProvider delayDuration={150} disableHoverableContent>
        {/* The static check lets bundlers drop the dev tools from production builds */}
        {process.env.NODE_ENV !== 'production' &&
          env.NODE_ENV === 'development' && <L2BeatDevTools />}
        <CountdownsContextProvider countdowns={countdowns}>
          <WhatsNewContextProvider whatsNew={whatsNew}>
            <WhatsNewItemProvider item={whatsNewItem}>
              <SearchBarContextProvider
                recentlyAddedProjects={recentlyAddedProjects}
              >
                <ChartLegendOnboardingProvider>
                  {children}
                </ChartLegendOnboardingProvider>
              </SearchBarContextProvider>
            </WhatsNewItemProvider>
          </WhatsNewContextProvider>
        </CountdownsContextProvider>
      </TooltipProvider>
    </TRPCReactProvider>
  )
}

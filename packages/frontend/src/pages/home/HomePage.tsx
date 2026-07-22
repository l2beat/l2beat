import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DarkThemeToggle } from '~/components/DarkThemeToggle'
import { SearchBarButton } from '~/components/search-bar/SearchBarButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeLayer2sCharts } from '~/server/features/home/getHomeLayer2sCharts'
import type { OngoingAnomaliesOverview } from '~/server/features/layer2s/liveness/getOngoingAnomaliesOverview'
import type { Layer2sSummaryEntry } from '~/server/features/layer2s/summary/getLayer2sSummaryEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import type { InteropFlowsProtocol } from '../interop/components/flows/utils/InteropFlowsContext'
import { HomeAnomaliesTile } from './components/HomeAnomaliesTile'
import { HomeEthereumCard } from './components/HomeEthereumCard'
import { HomeInteropCard } from './components/HomeInteropCard'
import { HomeLayer2sCard } from './components/HomeLayer2sCard'
import { HomeRecentChangesTile } from './components/HomeRecentChangesTile'
import { HomeRecentProjectsCard } from './components/HomeRecentProjectsCard'
import { HomeStatsStrip } from './components/HomeStatsStrip'
import { HomeTopChainsCard } from './components/HomeTopChainsCard'
import { HomeTopInteropProtocolsCard } from './components/HomeTopInteropProtocolsCard'
import { HomeWhatsNewCard } from './components/HomeWhatsNewCard'
import type { HomeRecentProject } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: HomeProjectCounts
  topChains: Layer2sSummaryEntry[]
  topChainsTvsData: TvsTableData
  layer2sCharts: HomeLayer2sCharts
  ethereumCharts: HomeEthereumCharts
  recentProjects: HomeRecentProject[]
  interopChains: InteropChainWithIcon[]
  interopProtocols: InteropFlowsProtocol[]
  defaultSelectedFlowChains: string[]
  layer2sCategoryCounts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
  recentChangesCount: number
  ongoingAnomalies: OngoingAnomaliesOverview
}

export function HomePage({
  queryState,
  projectCounts,
  topChains,
  topChainsTvsData,
  layer2sCharts,
  ethereumCharts,
  recentProjects,
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
  layer2sCategoryCounts,
  recentChangesCount,
  ongoingAnomalies,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout
          variant="home"
          childrenWrapperClassName="max-md:bg-surface-primary"
        >
          <header className="flex items-center gap-4 pt-[18px] pb-5 max-lg:hidden">
            <h1 className="font-bold text-[26px]">Home</h1>
            <div className="ml-auto flex shrink-0 items-center gap-4">
              <SearchBarButton />
              <DarkThemeToggle />
            </div>
          </header>
          {/* Mobile keeps a flat white page: cards lose their rounding and
                read as sections split by hairline dividers. Tablet+ (md)
                switches to real cards on the grey page background. */}
          <div className="flex flex-col md:gap-6 [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
            {/* xl: stacked rows — the three sidebar cards side by side on
                  top, then Layer 2s, Ethereum and Interop as full-width rows;
                  2xl switches to three columns (sidebar / charts / Interop). */}
            <div className="grid grid-cols-1 items-stretch md:gap-4 xl:gap-6 2xl:grid-cols-[minmax(260px,340px)_minmax(340px,1fr)_minmax(400px,1.35fr)]">
              <div className="flex h-full min-w-0 flex-col md:gap-4 xl:grid xl:grid-cols-3 xl:gap-6 2xl:flex">
                <HomeStatsStrip counts={projectCounts} />
                <HomeRecentProjectsCard
                  className="hidden h-auto xl:flex"
                  projects={recentProjects}
                />
                <HomeWhatsNewCard className="min-h-0 xl:flex-1" />
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col md:gap-4 xl:gap-6">
                <div className="flex min-h-0 flex-col xl:flex-1">
                  <HomeLayer2sCard
                    charts={layer2sCharts}
                    layer2sCategoryCounts={layer2sCategoryCounts}
                  />
                </div>
                <div className="flex min-h-0 flex-col xl:flex-1">
                  <HomeEthereumCard charts={ethereumCharts} />
                </div>
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col">
                <HomeInteropCard
                  interopChains={interopChains}
                  interopProtocols={interopProtocols}
                  defaultSelectedFlowChains={defaultSelectedFlowChains}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 max-md:contents sm:grid-cols-2 xl:gap-6">
              <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
              <HomeRecentChangesTile recentChangesCount={recentChangesCount} />
            </div>
            <div className="grid grid-cols-1 items-stretch md:gap-4 xl:gap-6 min-[1650px]:grid-cols-2">
              <HomeTopChainsCard
                entries={topChains}
                tvsData={topChainsTvsData}
              />
              <HomeTopInteropProtocolsCard
                interopChains={interopChains}
                defaultSelectedFlowChains={defaultSelectedFlowChains}
              />
            </div>
            <HomeRecentProjectsCard
              className="max-md:border-b-0! xl:hidden"
              projects={recentProjects}
            />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

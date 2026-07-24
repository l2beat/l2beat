import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DarkThemeToggle } from '~/components/DarkThemeToggle'
import { SearchBarButton } from '~/components/search-bar/SearchBarButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeScalingCharts } from '~/server/features/home/getHomeScalingCharts'
import type { OngoingAnomaliesOverview } from '~/server/features/scaling/liveness/getOngoingAnomaliesOverview'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import type { InteropFlowsProtocol } from '../interop/components/flows/utils/InteropFlowsContext'
import { HomeAnomaliesTile } from './components/HomeAnomaliesTile'
import { HomeEthereumCard } from './components/HomeEthereumCard'
import { HomeInteropCard } from './components/HomeInteropCard'
import type { HomeRecentChangesProject } from './components/HomeRecentChangesTile'
import { HomeRecentChangesTile } from './components/HomeRecentChangesTile'
import { HomeRecentProjectsCard } from './components/HomeRecentProjectsCard'
import type { HomeScalingCategoryCounts } from './components/HomeScalingCard'
import { HomeScalingCard } from './components/HomeScalingCard'
import { HomeStatsStrip } from './components/HomeStatsStrip'
import { HomeTopChainsCard } from './components/HomeTopChainsCard'
import { HomeTopInteropProtocolsCard } from './components/HomeTopInteropProtocolsCard'
import type { HomeWhatsNewItem } from './components/HomeWhatsNewCard'
import { HomeWhatsNewCard } from './components/HomeWhatsNewCard'
import type { HomeRecentProject } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: HomeProjectCounts
  topChains: ScalingSummaryEntry[]
  topChainsTvsData: TvsTableData
  scalingCharts: HomeScalingCharts
  ethereumCharts: HomeEthereumCharts
  ethereumEconomicSecurity: number | undefined
  recentProjects: HomeRecentProject[]
  interopChains: InteropChainWithIcon[]
  interopProtocols: InteropFlowsProtocol[]
  defaultSelectedFlowChains: string[]
  scalingCategoryCounts: HomeScalingCategoryCounts
  recentChangesCount: number
  recentChangesProjects: HomeRecentChangesProject[]
  ongoingAnomalies: OngoingAnomaliesOverview
  whatsNewItems: HomeWhatsNewItem[]
}

export function HomePage({
  queryState,
  projectCounts,
  topChains,
  topChainsTvsData,
  scalingCharts,
  ethereumCharts,
  ethereumEconomicSecurity,
  recentProjects,
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
  scalingCategoryCounts,
  recentChangesCount,
  recentChangesProjects,
  ongoingAnomalies,
  whatsNewItems,
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
                  top, then Scaling + Ethereum side by side, then Interop as
                  a full-width row; 2xl switches to three columns
                  (sidebar / charts / Interop). */}
            <div className="grid grid-cols-1 items-stretch md:gap-4 xl:gap-6 2xl:grid-cols-[minmax(260px,340px)_minmax(340px,1fr)_minmax(400px,1.35fr)]">
              <div className="flex h-full min-w-0 flex-col md:gap-4 xl:grid xl:grid-cols-3 xl:gap-6 2xl:flex">
                <HomeStatsStrip counts={projectCounts} />
                <HomeRecentProjectsCard
                  className="hidden h-auto xl:flex"
                  projects={recentProjects}
                />
                <HomeWhatsNewCard
                  items={whatsNewItems}
                  className="min-h-0 xl:flex-1"
                />
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col md:grid md:grid-cols-2 md:gap-4 xl:gap-6 2xl:flex 2xl:flex-col">
                <div className="flex min-h-0 min-w-0 flex-col xl:flex-1">
                  <HomeScalingCard
                    charts={scalingCharts}
                    scalingCategoryCounts={scalingCategoryCounts}
                  />
                </div>
                <div className="flex min-h-0 min-w-0 flex-col xl:flex-1">
                  <HomeEthereumCard
                    charts={ethereumCharts}
                    economicSecurity={ethereumEconomicSecurity}
                  />
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
              <HomeRecentChangesTile
                recentChangesCount={recentChangesCount}
                recentChangesProjects={recentChangesProjects}
              />
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

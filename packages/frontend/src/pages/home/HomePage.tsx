import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeScalingCharts } from '~/server/features/home/getHomeScalingCharts'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { OngoingAnomaliesOverview } from '~/server/features/scaling/liveness/getOngoingAnomaliesOverview'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
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
import { HomeTopPrivacyProtocolsCard } from './components/HomeTopPrivacyProtocolsCard'
import { HomeTopZkProversCard } from './components/HomeTopZkProversCard'
import type { HomeWhatsNewItem } from './components/HomeWhatsNewCard'
import { HomeWhatsNewCard } from './components/HomeWhatsNewCard'
import type { HomeRecentProject } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: HomeProjectCounts
  topChains: ScalingSummaryEntry[]
  topChainsTvsData: TvsTableData
  topPrivacyProtocols: PrivacySummaryEntry[]
  topZkProvers: ZkCatalogEntry[]
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
  whatsNewItem: HomeWhatsNewItem | undefined
}

export function HomePage({
  queryState,
  projectCounts,
  topChains,
  topChainsTvsData,
  topPrivacyProtocols,
  topZkProvers,
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
  whatsNewItem,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout
          variant="home"
          childrenWrapperClassName="max-md:bg-surface-primary"
        >
          <MainPageHeader>Home</MainPageHeader>
          <div className="flex flex-col md:gap-4 xl:gap-6 [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
            <div className="grid grid-cols-1 items-stretch md:gap-4 xl:grid-cols-[minmax(260px,340px)_minmax(340px,1fr)] xl:gap-6 2xl:grid-cols-[minmax(260px,340px)_minmax(340px,1fr)_minmax(400px,1.35fr)]">
              <div className="flex h-full min-w-0 flex-col md:gap-4 lg:max-xl:hidden">
                <HomeStatsStrip counts={projectCounts} className="lg:hidden" />
                <HomeRecentProjectsCard
                  className="hidden h-auto xl:flex"
                  projects={recentProjects}
                />
                <HomeWhatsNewCard
                  item={whatsNewItem}
                  className="min-h-0 xl:flex-1"
                />
                <HomeAnomaliesTile
                  ongoingAnomalies={ongoingAnomalies}
                  className="max-xl:hidden"
                />
                <HomeRecentChangesTile
                  recentChangesCount={recentChangesCount}
                  recentChangesProjects={recentChangesProjects}
                  className="max-xl:hidden"
                />
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col 2xl:hidden">
                <HomeInteropCard
                  interopChains={interopChains}
                  interopProtocols={interopProtocols}
                  defaultSelectedFlowChains={defaultSelectedFlowChains}
                />
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col md:grid md:grid-cols-2 md:gap-4 xl:gap-6 xl:max-2xl:col-span-full 2xl:flex 2xl:flex-col">
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
              <div className="flex h-full min-h-0 min-w-0 flex-col max-2xl:hidden">
                <HomeInteropCard
                  interopChains={interopChains}
                  interopProtocols={interopProtocols}
                  defaultSelectedFlowChains={defaultSelectedFlowChains}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 max-md:contents xl:hidden">
              <div className="grid gap-4 sm:grid-cols-2">
                <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
                <HomeRecentChangesTile
                  recentChangesCount={recentChangesCount}
                  recentChangesProjects={recentChangesProjects}
                />
              </div>
              <HomeWhatsNewCard
                item={whatsNewItem}
                className="h-full flex-1 xl:hidden"
              />
              <HomeRecentProjectsCard
                className="xl:hidden"
                projects={recentProjects}
              />
            </div>

            <div className="grid grid-cols-1 items-stretch md:gap-4 lg:grid-cols-2 xl:gap-6">
              <HomeTopInteropProtocolsCard
                interopChains={interopChains}
                defaultSelectedFlowChains={defaultSelectedFlowChains}
              />
              <HomeTopPrivacyProtocolsCard entries={topPrivacyProtocols} />
              <HomeTopChainsCard
                entries={topChains}
                tvsData={topChainsTvsData}
              />
              <HomeTopZkProversCard entries={topZkProvers} />
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

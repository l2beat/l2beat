import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { OngoingAnomaliesOverview } from '~/server/features/layer2s/liveness/getOngoingAnomaliesOverview'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import type { InteropFlowsProtocol } from '../interop/components/flows/utils/InteropFlowsContext'
import { HomeAnomaliesTile } from './components/HomeAnomaliesTile'
import { HomeEthereumCard } from './components/HomeEthereumCard'
import { HomeInteropCard } from './components/HomeInteropCard'
import type { HomeL2CategoryCounts } from './components/HomeL2Card'
import { HomeL2Card } from './components/HomeL2Card'
import type { HomeRecentChangesProject } from './components/HomeRecentChangesTile'
import { HomeRecentChangesTile } from './components/HomeRecentChangesTile'
import { HomeRecentProjectsCard } from './components/HomeRecentProjectsCard'
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
  topChains: L2SummaryEntry[]
  topChainsTvsData: TvsTableData
  topPrivacyProtocols: PrivacySummaryEntry[]
  topZkProvers: ZkCatalogEntry[]
  l2Charts: HomeL2Charts
  ethereumCharts: HomeEthereumCharts
  ethereumEconomicSecurity: number | undefined
  recentProjects: HomeRecentProject[]
  interopChains: InteropChainWithIcon[]
  interopProtocols: InteropFlowsProtocol[]
  defaultSelectedFlowChains: string[]
  l2CategoryCounts: HomeL2CategoryCounts
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
  l2Charts,
  ethereumCharts,
  ethereumEconomicSecurity,
  recentProjects,
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
  l2CategoryCounts,
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
            <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-[minmax(260px,280px)_minmax(280px,1fr)] xl:gap-6 2xl:grid-cols-[minmax(260px,340px)_minmax(340px,1fr)_minmax(400px,1.35fr)]">
              <HomeStatsStrip counts={projectCounts} className="lg:hidden" />
              <div className="flex min-w-0 flex-col gap-4 max-lg:hidden">
                <HomeRecentProjectsCard
                  className="h-auto"
                  projects={recentProjects}
                />
                <HomeWhatsNewCard
                  item={whatsNewItem}
                  className="min-h-0 flex-1"
                />
                <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
                <HomeRecentChangesTile
                  recentChangesCount={recentChangesCount}
                  recentChangesProjects={recentChangesProjects}
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-col 2xl:order-last">
                <HomeInteropCard
                  interopChains={interopChains}
                  interopProtocols={interopProtocols}
                  defaultSelectedFlowChains={defaultSelectedFlowChains}
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-col md:grid md:grid-cols-2 md:gap-4 lg:max-2xl:col-span-full xl:gap-6 2xl:flex">
                <div className="flex min-h-0 min-w-0 flex-col 2xl:flex-1">
                  <HomeL2Card
                    charts={l2Charts}
                    l2CategoryCounts={l2CategoryCounts}
                  />
                </div>
                <div className="flex min-h-0 min-w-0 flex-col 2xl:flex-1">
                  <HomeEthereumCard
                    charts={ethereumCharts}
                    economicSecurity={ethereumEconomicSecurity}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 max-md:contents lg:hidden">
              <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
              <HomeRecentChangesTile
                recentChangesCount={recentChangesCount}
                recentChangesProjects={recentChangesProjects}
              />
              <HomeWhatsNewCard item={whatsNewItem} />
              <HomeRecentProjectsCard projects={recentProjects} />
            </div>
            <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-2 xl:gap-6">
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

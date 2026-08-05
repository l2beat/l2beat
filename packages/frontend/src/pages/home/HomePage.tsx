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
import { getNavSectionCounts } from './getNavSectionCounts'

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
  whatsNewItems: HomeWhatsNewItem[]
}

/**
 * One grid holds the whole page so the sections can be re-ordered per
 * breakpoint without duplicating any card:
 *
 * - from `xl`: the four secondary cards are a single stack to the left of the
 *   interop card, with the two chart cards spanning the full width below them.
 * - below `xl`: one column - secondary cards, charts, interop, status tiles,
 *   tables - which is the order the page has always had on tablet and mobile.
 *
 * The project counts live in the side nav rather than in a card of their own.
 */
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
  whatsNewItems,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout
          variant="home"
          childrenWrapperClassName="max-md:bg-surface-primary"
          sidebarCounts={getNavSectionCounts(projectCounts)}
          sidebarColorfulIcons
        >
          <MainPageHeader>Home</MainPageHeader>
          <div className="grid grid-cols-1 items-stretch md:gap-6 xl:grid-cols-[minmax(320px,440px)_minmax(0,1fr)] xl:gap-x-4 2xl:grid-cols-[minmax(360px,480px)_minmax(0,1fr)] 2xl:gap-x-6 min-[2200px]:grid-cols-[minmax(340px,460px)_minmax(360px,1fr)_minmax(560px,1.1fr)] [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
            {/* The side nav carries these counts from xl up, but below that the
                nav sits behind the menu button, so the card takes over. */}
            <HomeStatsStrip
              counts={projectCounts}
              className="max-xl:order-1 xl:hidden"
            />
            {/* From xl this is the stack beside the interop card. Below xl it is
                `display: contents`, so its cards become items of the page grid
                and can be ordered independently - What's new right after the
                counts, Recently added near the bottom, as before. */}
            <div className="max-xl:contents xl:flex xl:h-full xl:min-w-0 xl:flex-col xl:gap-4 2xl:gap-6">
              {/* h-auto overrides the card's own h-full, which would otherwise
                  eat the whole stack and leave nothing for What's new */}
              <HomeRecentProjectsCard
                className="h-auto shrink-0 max-xl:order-6"
                projects={recentProjects}
              />
              {/* From xl this is the tall image-with-overlay card and the one
                  item that absorbs the leftover height, so the column ends level
                  with the ones beside it. The floor keeps it from being squeezed
                  into an unreadable strip on a short window; the ceiling keeps it
                  from becoming the loudest thing on the page in the two column
                  hero, where the interop card can run much taller than the rest
                  of the stack. */}
              <HomeWhatsNewCard
                items={whatsNewItems}
                className="min-h-0 max-xl:order-2 xl:max-h-72 xl:min-h-52 xl:flex-1 min-[2200px]:max-h-none"
              />
              <div className="max-xl:hidden">
                <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
              </div>
              <div className="max-xl:hidden">
                <HomeRecentChangesTile
                  recentChangesCount={recentChangesCount}
                  recentChangesProjects={recentChangesProjects}
                />
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-col max-xl:order-4 xl:col-start-2 xl:row-start-1 xl:h-full min-[2200px]:col-start-3">
              <HomeInteropCard
                interopChains={interopChains}
                interopProtocols={interopProtocols}
                defaultSelectedFlowChains={defaultSelectedFlowChains}
              />
            </div>
            <div className="grid grid-cols-1 items-stretch max-xl:order-3 md:grid-cols-2 md:gap-4 xl:col-span-2 xl:row-start-2 xl:gap-4 2xl:gap-6 min-[2200px]:col-span-1 min-[2200px]:col-start-2 min-[2200px]:row-start-1 min-[2200px]:flex min-[2200px]:flex-col">
              <div className="flex min-h-0 min-w-0 flex-col min-[2200px]:flex-1">
                <HomeScalingCard
                  charts={scalingCharts}
                  scalingCategoryCounts={scalingCategoryCounts}
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-col min-[2200px]:flex-1">
                <HomeEthereumCard
                  charts={ethereumCharts}
                  economicSecurity={ethereumEconomicSecurity}
                />
              </div>
            </div>
            {/* From xl these two sit in the stack above instead. Stays a real
                box (rather than `display: contents`) so its order applies on
                phones too, where it belongs after the interop card. */}
            <div className="grid grid-cols-1 gap-0 max-xl:order-5 md:grid-cols-2 md:gap-4 xl:hidden">
              <HomeAnomaliesTile ongoingAnomalies={ongoingAnomalies} />
              <HomeRecentChangesTile
                recentChangesCount={recentChangesCount}
                recentChangesProjects={recentChangesProjects}
              />
            </div>
            <div className="grid grid-cols-1 items-stretch max-xl:order-7 md:gap-4 lg:grid-cols-2 xl:col-span-2 xl:row-start-3 xl:gap-6 min-[2200px]:col-span-3 min-[2200px]:row-start-2">
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

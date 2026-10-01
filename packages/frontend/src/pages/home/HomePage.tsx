import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import type { InteropFlowsProtocol } from '../interop/components/flows/utils/InteropFlowsContext'
import { HomeCropsBanner } from './components/HomeCropsBanner'
import { HomeEthereumCard } from './components/HomeEthereumCard'
import { HomeInteropSection } from './components/HomeInteropSection'
import { HomeL2Card } from './components/HomeL2Card'
import { HomeMandateBanner } from './components/HomeMandateBanner'
import { HomePrivacyCard } from './components/HomePrivacyCard'
import { HomeQuestionCard } from './components/HomeQuestionCard'
import { HomeStatsStrip } from './components/HomeStatsStrip'
import {
  HomeLatestArticlesSection,
  HomeProjectChangesSection,
  type HomeRecentChangesProject,
  HomeWhatsNewHeadline,
  type HomeWhatsNewItem,
  HomeWhatsNewProjects,
} from './components/HomeWhatsNewSection'
import type { HomeCropsProject } from './getHomeCropsProjects'
import type { HomeRecentProject, HomeTopL2Project } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'
import type { HomeResearchItem } from './getHomeResearch'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: HomeProjectCounts
  cropsProjects: HomeCropsProject[]
  l2Charts: HomeL2Charts
  topL2Projects: HomeTopL2Project[]
  privacy: HomePrivacyData
  ethereumCharts: HomeEthereumCharts
  interopFlowChains: InteropChainWithIcon[]
  interopDefaultFlowChains: string[]
  flowProtocols: InteropFlowsProtocol[]
  recentProjects: HomeRecentProject[]
  recentChangesCount: number
  recentChangesProjects: HomeRecentChangesProject[]
  whatsNewItem: HomeWhatsNewItem | undefined
  research: HomeResearchItem[]
}

export function HomePage({
  queryState,
  projectCounts,
  cropsProjects,
  l2Charts,
  topL2Projects,
  privacy,
  ethereumCharts,
  interopFlowChains,
  interopDefaultFlowChains,
  flowProtocols,
  recentProjects,
  recentChangesCount,
  recentChangesProjects,
  whatsNewItem,
  research,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout variant="home">
          {/* The page runs edge to edge so section hairlines reach from the
              nav to the screen's edge; content keeps one gutter from both. */}
          <div className="[--home-gutter:--spacing(4)] md:[--home-gutter:--spacing(6)] xl:[--home-gutter:--spacing(8)] 2xl:[--home-gutter:--spacing(10)]">
            <div className="px-(--home-gutter)">
              <MainPageHeader>Home</MainPageHeader>
            </div>
            {/* No boxes: sections sit on the page background, a hairline
                above each. From lg the page is one three-column grid, Layer
                2s | Privacy | what's new, with a line between columns and 24px
                either side of it, the gutter at the outer edges, so every
                column's content lines up down the page. A last hairline
                closes it above the footer, where the column line ends. */}
            <div className="@container/home grid grid-cols-1 border-divider border-b lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,280px)] lg:grid-rows-[auto_auto_auto_1fr_auto_auto] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(340px,400px)]">
              {/* CROPS and the mandate. From lg they split at the column
                  line, 8px either side of it, the outer edges level with the
                  content below. */}
              <div className="flex flex-col md:mx-(--home-gutter) md:mb-6 md:flex-row md:gap-4 lg:col-span-full lg:mx-0 lg:grid lg:grid-cols-subgrid lg:gap-0">
                <HomeCropsBanner
                  projects={cropsProjects}
                  className="md:flex-1 lg:col-span-2 lg:mr-2 lg:ml-(--home-gutter)"
                />
                <HomeMandateBanner className="max-md:border-t-0 md:w-80 md:shrink-0 lg:mr-(--home-gutter) lg:ml-2 lg:w-auto" />
              </div>
              {/* On phones the CROPS band's own border is the line above. */}
              <HomeStatsStrip
                counts={projectCounts}
                className="max-md:border-t-0 lg:hidden"
              />
              {/* From lg the page has six rows: CROPS; the domain cards'
                  title, charts and rankings; Ethereum; what follows it. */}
              {/* The right column: what's new. From lg it shares the domain
                  cards' rows: the announcement sits on the chart row and new
                  projects on the ranking row, so both end on the same lines
                  as the cards beside them. Below lg it dissolves and comes
                  first. Its sections pad themselves, so their hairlines reach
                  both ends. */}
              <div className="max-lg:contents lg:col-start-3 lg:row-span-3 lg:row-start-2 lg:grid lg:min-w-0 lg:grid-rows-subgrid lg:border-divider lg:border-l">
                <HomeWhatsNewHeadline item={whatsNewItem} className="lg:pl-6" />
                <HomeWhatsNewProjects
                  projects={recentProjects}
                  className="lg:row-start-3 lg:pl-6"
                />
              </div>
              {/* The twin cards subgrid the title, chart and ranking rows. The
                  ranking row is the flexible one, so any height the right
                  column adds lands there. */}
              <div className="grid @min-[880px]/home:grid-cols-2 grid-cols-1 lg:col-span-2 lg:col-start-1 lg:row-span-3 lg:row-start-2 lg:grid-cols-subgrid lg:grid-rows-subgrid">
                <HomeL2Card
                  charts={l2Charts}
                  topProjects={topL2Projects}
                  className="@min-[880px]/home:pr-6"
                />
                <HomePrivacyCard
                  data={privacy}
                  className="@min-[880px]/home:border-l @min-[880px]/home:pl-6 lg:pr-6"
                />
              </div>
              {/* From lg, Ethereum and the sections under it take the
                  Layer 2s column; interop takes the other two, beside them. */}
              <HomeEthereumCard
                charts={ethereumCharts}
                className="lg:col-start-1 lg:row-start-5 lg:pr-6"
              />
              <HomeInteropSection
                chains={interopFlowChains}
                defaultSelectedChains={interopDefaultFlowChains}
                protocols={flowProtocols}
                className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-5 lg:border-l"
              />
              <div className="flex min-w-0 flex-col lg:col-start-1 lg:row-start-6">
                <HomeLatestArticlesSection
                  research={research}
                  className="lg:pr-6"
                />
                <HomeProjectChangesSection
                  count={recentChangesCount}
                  projects={recentChangesProjects}
                  className="lg:pr-6"
                />
                <HomeQuestionCard className="lg:pr-6" />
              </div>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

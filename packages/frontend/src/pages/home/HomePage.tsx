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
import { HomePrivacyCard } from './components/HomePrivacyCard'
import { HomeStatsStrip } from './components/HomeStatsStrip'
import {
  HomeProjectChangesSection,
  type HomeRecentChangesProject,
  HomeWhatsNewProjects,
} from './components/HomeWhatsNewSection'
import type { HomeCropsProject } from './getHomeCropsProjects'
import type { HomeRecentProject, HomeTopL2Project } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'

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
                above each. From lg the page is one two-column grid, Privacy |
                Layer 2s, with a line between the columns and 24px either side
                of it, the gutter at the outer edges, so every column's
                content lines up down the page. What's new lives in the nav
                there. A last hairline closes it above the footer, where the
                column line ends. */}
            <div className="@container/home grid grid-cols-1 border-divider border-b lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_1fr_auto_auto]">
              {/* Below lg, where the sidebar hides behind the menu button,
                  its menu opens the page, CROPS first; the big CROPS banner
                  stays a desktop thing. It comes right under the top bar, so
                  it draws no line of its own. */}
              <HomeStatsStrip
                counts={projectCounts}
                className="border-t-0 pt-4 md:pt-0 lg:hidden"
              />
              {/* CROPS, from lg, across the row, its outer edges level with
                  the content below. The mandate lives on the landing page. */}
              <HomeCropsBanner
                projects={cropsProjects}
                className="max-lg:hidden lg:col-span-full lg:mx-(--home-gutter) lg:mb-6"
              />
              {/* From lg the page has six rows: CROPS; the domain cards'
                  title, charts and rankings; Ethereum; what follows it. */}
              {/* The twin cards subgrid the title, chart and ranking rows, so
                  their parts stay level. */}
              <div className="grid @min-[880px]/home:grid-cols-2 grid-cols-1 lg:col-span-2 lg:col-start-1 lg:row-span-3 lg:row-start-2 lg:grid-cols-subgrid lg:grid-rows-subgrid">
                <HomePrivacyCard
                  data={privacy}
                  projectCount={projectCounts.privacy}
                  className="@min-[880px]/home:pr-6"
                />
                <HomeL2Card
                  charts={l2Charts}
                  topProjects={topL2Projects}
                  projectCount={projectCounts.l2}
                  className="@min-[880px]/home:border-l @min-[880px]/home:pl-6"
                />
              </div>
              {/* From lg, Ethereum and the sections under it take the
                  Privacy column; interop takes the other, beside them. */}
              <HomeEthereumCard
                charts={ethereumCharts}
                className="lg:col-start-1 lg:row-start-5 lg:pr-6"
              />
              <HomeInteropSection
                chains={interopFlowChains}
                defaultSelectedChains={interopDefaultFlowChains}
                protocols={flowProtocols}
                className="lg:col-start-2 lg:row-span-2 lg:row-start-5 lg:border-l"
              />
              {/* Under Ethereum: new research and project changes, side by
                  side once wide enough, a line between them; stacked below.
                  Articles and the forum live on the landing page. */}
              <div className="@container/recent grid min-w-0 @min-[560px]/recent:grid-cols-2 grid-cols-1 lg:col-start-1 lg:row-start-6">
                <HomeWhatsNewProjects
                  projects={recentProjects}
                  className="@min-[560px]/recent:pr-6"
                />
                <HomeProjectChangesSection
                  count={recentChangesCount}
                  projects={recentChangesProjects}
                  className="@min-[560px]/recent:border-divider @min-[560px]/recent:border-l @min-[560px]/recent:pl-6 lg:pr-6"
                />
              </div>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

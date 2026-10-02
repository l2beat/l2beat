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
              {/* CROPS and the mandate. From lg they share a row, the mandate
                  at the width the old right column had, 16px between them and
                  the outer edges level with the content below; below lg only
                  the mandate shows, under the menu. */}
              <div className="flex flex-col lg:col-span-full lg:mx-(--home-gutter) lg:mb-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,280px)] lg:gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
                <HomeCropsBanner
                  projects={cropsProjects}
                  className="max-lg:hidden"
                />
                <HomeMandateBanner />
              </div>
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
              {/* Under Ethereum: articles, new research, project changes and,
                  always last in its column, the question. */}
              <div className="@container/recent flex min-w-0 flex-col lg:col-start-1 lg:row-start-6">
                {/* Two columns once wide enough: articles and the question,
                    then new research (its rows fill the height the left
                    column sets) and project changes. Stacked, the columns
                    dissolve so the question can come last. */}
                <div className="flex @min-[560px]/recent:grid min-w-0 @min-[560px]/recent:grid-cols-2 flex-col">
                  <div className="@min-[560px]/recent:flex contents @min-[560px]/recent:min-w-0 @min-[560px]/recent:flex-col">
                    <HomeLatestArticlesSection
                      research={research}
                      className="lg:pr-6"
                    />
                    <HomeQuestionCard className="@min-[560px]/recent:order-none order-last lg:pr-6" />
                  </div>
                  <div className="@min-[560px]/recent:flex contents @min-[560px]/recent:min-w-0 @min-[560px]/recent:flex-col @min-[560px]/recent:border-divider @min-[560px]/recent:border-l">
                    <HomeWhatsNewProjects
                      projects={recentProjects}
                      className="@min-[560px]/recent:flex-1 @min-[560px]/recent:pl-6 lg:pr-6"
                    />
                    <HomeProjectChangesSection
                      count={recentChangesCount}
                      projects={recentChangesProjects}
                      className="@min-[560px]/recent:pl-6 lg:pr-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

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
        <SideNavLayout
          variant="home"
          childrenWrapperClassName="max-md:bg-surface-primary"
        >
          <MainPageHeader>Home</MainPageHeader>
          {/* Cards on the page background, like the rest of the site. On
              phones they run edge to edge with a hairline between them. */}
          <div className="@container/home flex flex-col md:gap-4 [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
            {/* Below lg the sidebar hides behind the menu button, so its
                menu opens the page instead, CROPS first. */}
            <HomeStatsStrip counts={projectCounts} className="lg:hidden" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,280px)] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
              <HomeCropsBanner
                projects={cropsProjects}
                className="max-lg:hidden"
              />
              <HomeMandateBanner />
            </div>
            {/* The twin cards subgrid their title, chart and ranking rows, so
                their parts stay level. */}
            <div className="grid @min-[880px]/home:grid-cols-2 grid-cols-1 md:gap-4">
              <HomePrivacyCard
                data={privacy}
                projectCount={projectCounts.privacy}
              />
              <HomeL2Card
                charts={l2Charts}
                topProjects={topL2Projects}
                projectCount={projectCounts.l2}
              />
            </div>
            <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col md:gap-4">
                <HomeEthereumCard charts={ethereumCharts} />
                <HomeRecentCards
                  research={research}
                  recentProjects={recentProjects}
                  recentChangesCount={recentChangesCount}
                  recentChangesProjects={recentChangesProjects}
                />
              </div>
              <HomeInteropSection
                chains={interopFlowChains}
                defaultSelectedChains={interopDefaultFlowChains}
                protocols={flowProtocols}
              />
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

/**
 * Under Ethereum: two columns once wide enough, articles and the question,
 * then new research (its rows fill the height the left column sets) and
 * project changes. Stacked, the columns dissolve so the question comes last.
 */
function HomeRecentCards({
  research,
  recentProjects,
  recentChangesCount,
  recentChangesProjects,
}: {
  research: HomeResearchItem[]
  recentProjects: HomeRecentProject[]
  recentChangesCount: number
  recentChangesProjects: HomeRecentChangesProject[]
}) {
  return (
    <div className="@container/recent flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex @min-[560px]/recent:grid min-w-0 flex-1 @min-[560px]/recent:grid-cols-2 flex-col md:gap-4">
        <div className="@min-[560px]/recent:flex contents @min-[560px]/recent:min-w-0 @min-[560px]/recent:flex-col md:gap-4">
          <HomeLatestArticlesSection research={research} />
          <HomeQuestionCard className="@min-[560px]/recent:order-none order-last @min-[560px]/recent:flex-1" />
        </div>
        <div className="@min-[560px]/recent:flex contents @min-[560px]/recent:min-w-0 @min-[560px]/recent:flex-col md:gap-4">
          <HomeWhatsNewProjects
            projects={recentProjects}
            className="@min-[560px]/recent:flex-1"
          />
          <HomeProjectChangesSection
            count={recentChangesCount}
            projects={recentChangesProjects}
          />
        </div>
      </div>
    </div>
  )
}

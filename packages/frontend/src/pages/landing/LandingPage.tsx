import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { Footer } from '~/components/Footer'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import type { HomeRecentProject } from '../home/getHomeData'
import type { HomeResearchItem } from '../home/getHomeResearch'
import {
  LandingCharts,
  type LandingChartsData,
} from './components/LandingCharts'
import { LandingDomainCards } from './components/LandingDomainCards'
import { LandingHeader } from './components/LandingHeader'
import { LandingHero } from './components/LandingHero'
import { LandingRecentProjects } from './components/LandingRecentProjects'
import { LandingTextSections } from './components/LandingTextSections'
import type { LandingCounts } from './getLandingData'
import { LANDING_CONTAINER_CLASS } from './landingStyles'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  charts: LandingChartsData
  counts: LandingCounts
  recentProjects: HomeRecentProject[]
  research: HomeResearchItem[]
}

/**
 * The front door, in front of the app: what L2BEAT is, in one line, and
 * where its work lives, then the home page's charts under it. No nav; one
 * white sheet, hairlines only.
 */
export function LandingPage({
  queryState,
  charts,
  counts,
  recentProjects,
  research,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <div className="flex min-h-screen flex-col bg-pure-white dark:bg-pure-black">
          <LandingHeader />
          <main className="flex grow flex-col">
            <LandingHero />
            <LandingDomainCards counts={counts} />
            <LandingRecentProjects projects={recentProjects} />
            <LandingTextSections research={research} />
            <LandingCharts data={charts} />
          </main>
          <Footer
            className={`${LANDING_CONTAINER_CLASS} border-divider border-t py-5 md:py-5 lg:pb-5`}
            innerContainerClassName="max-w-none"
          />
        </div>
      </HydrationBoundary>
    </AppLayout>
  )
}

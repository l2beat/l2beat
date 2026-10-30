import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { type ComponentProps, useEffect } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import { cn } from '~/utils/cn'
import { HomeCropsBanner } from './components/HomeCropsBanner'
import { HomeEthereumCard } from './components/HomeEthereumCard'
import { HomeL2Card } from './components/HomeL2Card'
import { HomeMandateBanner } from './components/HomeMandateBanner'
import { HomePrivacyCard } from './components/HomePrivacyCard'
import { HomeQuestionCard } from './components/HomeQuestionCard'
import { HomeRecentColumn } from './components/HomeRecentColumn'
import type { HomeStackedIcon } from './components/HomeStackedIcons'
import { HomeInteropSection } from './components/interop/HomeInteropSection'
import type { HomeRecentProject, HomeTopL2Project } from './getHomeData'
import type { HomeProjectCounts } from './getHomeProjectCounts'
import type { HomeResearchItem } from './getHomeResearch'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: HomeProjectCounts
  cropsProjects: HomeStackedIcon[]
  l2Charts: HomeL2Charts
  topL2Projects: HomeTopL2Project[]
  privacy: HomePrivacyData
  ethereumCharts: HomeEthereumCharts
  interop: ComponentProps<typeof HomeInteropSection>
  recentProjects: HomeRecentProject[]
  recentChanges: { count: number; projects: HomeStackedIcon[] }
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
  interop,
  recentProjects,
  recentChanges,
  research,
  ...props
}: Props) {
  // See .home-theme in globals.css: the wrapper below themes the first paint,
  // <html> themes what portals to <body>.
  useEffect(() => {
    document.documentElement.classList.add('home-theme')
    return () => document.documentElement.classList.remove('home-theme')
  }, [])
  const hasCrops = cropsProjects.length > 0

  return (
    // Home shows What's new in its own card, so not in the nav too.
    <AppLayout {...props} whatsNewItem={undefined}>
      <HydrationBoundary state={queryState}>
        <div className="home-theme contents">
          <SideNavLayout
            variant="home"
            childrenWrapperClassName="max-md:bg-surface-primary"
          >
            <MainPageHeader>Home</MainPageHeader>
            {/* Cards as on every other page: 16px apart from md, edge to edge
              with a line between them below it. The last one leaves its line
              to the footer's. The outer box is the size container, so the
              inner one can turn into the three-column grid (`home-wide`). */}
            <div className="@container/home">
              <div
                className={cn(
                  'flex home-wide:grid home-wide:grid-cols-3 flex-col md:gap-4 [&>.primary-card:last-child]:max-md:border-b-0 [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b',
                  hasCrops
                    ? 'home-wide:home-areas'
                    : 'home-wide:home-areas-no-crops',
                )}
              >
                {/* Without the garden (it is behind a flag) the mandate takes
                  the row. */}
                <div className="grid home-wide:contents grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(280px,300px)] md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,320px)] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
                  {hasCrops && (
                    <HomeCropsBanner
                      projects={cropsProjects}
                      className="home-wide:[grid-area:crops]"
                    />
                  )}
                  <HomeMandateBanner
                    className={cn(
                      !hasCrops && 'col-span-full',
                      'home-wide:[grid-area:mandate]',
                    )}
                  />
                </div>
                {/* The domain cards subgrid the title, chart and ranking rows,
                  so their parts stay level. */}
                <div className="grid home-wide:contents @min-[880px]/home:grid-cols-2 grid-cols-1 md:gap-4">
                  <HomePrivacyCard
                    data={privacy}
                    projectCount={projectCounts.privacy}
                    className="home-wide:[grid-area:privacy]"
                  />
                  <HomeL2Card
                    charts={l2Charts}
                    topProjects={topL2Projects}
                    projectCount={projectCounts.l2}
                    className="home-wide:[grid-area:l2]"
                  />
                </div>
                {/* Interop beside Ethereum and the recent cards, as tall as
                  they are. Stacked below lg, the column dissolves so Interop
                  follows Ethereum, the data before the reading. */}
                <div className="grid home-wide:contents grid-cols-1 md:gap-4 lg:grid-cols-2">
                  <div className="flex home-wide:contents min-w-0 flex-col max-lg:contents md:gap-4">
                    <HomeEthereumCard
                      charts={ethereumCharts}
                      className="home-wide:[grid-area:ethereum]"
                    />
                    <HomeRecentColumn
                      research={research}
                      recentChanges={recentChanges}
                      recentProjects={recentProjects}
                    />
                  </div>
                  <HomeInteropSection
                    {...interop}
                    className="home-wide:[grid-area:interop]"
                  />
                </div>
                {/* The page's one action, last, across the full width. */}
                <HomeQuestionCard className="home-wide:[grid-area:question]" />
              </div>
            </div>
          </SideNavLayout>
        </div>
      </HydrationBoundary>
    </AppLayout>
  )
}

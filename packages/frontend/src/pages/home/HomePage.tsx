import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { type ComponentProps, useEffect } from 'react'
import { TooltipsInPortal } from '~/components/core/tooltip/Tooltip'
import { MainPageHeader } from '~/components/MainPageHeader'
import { CardBoard } from '~/components/primary-card/CardBoard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomeLiquidStaking } from '~/server/features/home/getHomeLiquidStaking'
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
  liquidStaking: HomeLiquidStaking | undefined
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
  liquidStaking,
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
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <div className="home-theme contents">
          <SideNavLayout
            variant="home"
            childrenWrapperClassName="max-md:bg-surface-primary"
          >
            <MainPageHeader>Home</MainPageHeader>
            {/* The banners, one card of data split by lines, and the
              question: 16px apart from md, edge to edge with a line between
              them below it. The last one leaves its line to the footer's.
              The outer box is the size container, so the board can turn
              into the three-column grid (`home-wide`). */}
            {/* The cards sit in size containers, which misplace tooltips. */}
            <TooltipsInPortal>
              <div className="@container/home">
                <div className="flex flex-col md:gap-4 [&>.primary-card:last-child]:max-md:border-b-0 [&_.primary-card]:max-md:rounded-none [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
                  {/* Without the garden (it is behind a flag) the mandate takes
                    the row. On phones it comes later, after Ethereum. */}
                  <div className="grid grid-cols-1 home-wide:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(280px,300px)] md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,320px)] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
                    {hasCrops && <HomeCropsBanner projects={cropsProjects} />}
                    <HomeMandateBanner
                      className={cn(
                        !hasCrops && 'col-span-full',
                        'max-md:hidden',
                      )}
                    />
                  </div>
                  <CardBoard layoutClassName="home-wide:home-tracks flex home-wide:grid flex-col">
                    {/* The domain blocks subgrid the title, chart and
                        ranking rows, so their parts stay level. */}
                    <div className="md:board-gap grid home-wide:contents @min-[880px]/home:grid-cols-2 grid-cols-1">
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
                    {/* Interop beside Ethereum and the recent blocks, as
                        tall as they are. Stacked below lg, the column
                        dissolves so Interop follows Ethereum, the data before
                        the reading. */}
                    <div className="md:board-gap grid home-wide:contents grid-cols-1 lg:grid-cols-2">
                      <div className="md:board-gap flex home-wide:contents min-w-0 flex-col max-lg:contents">
                        <HomeEthereumCard
                          charts={ethereumCharts}
                          liquidStaking={liquidStaking}
                          className="home-wide:[grid-area:ethereum]"
                        />
                        {/* The phones' mandate, between Ethereum and Interop. */}
                        <HomeMandateBanner className="md:hidden" />
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
                  </CardBoard>
                  {/* The page's one action, last, across the full width. */}
                  <HomeQuestionCard />
                </div>
              </div>
            </TooltipsInPortal>
          </SideNavLayout>
        </div>
      </HydrationBoundary>
    </AppLayout>
  )
}

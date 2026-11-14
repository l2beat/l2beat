import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { env } from '~/env'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import type { ProjectSectionLink } from '~/server/features/projects/getProjectSectionLinks'
import type { ProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { cn } from '~/utils/cn'
import { LiquidStakingProjectSummary } from './components/LiquidStakingProjectSummary'

interface Props extends AppLayoutProps {
  entry: ProjectDefiEntry
  sectionLinks: ProjectSectionLink[]
  versionLinks?: ProjectVersionLinks
  queryState: DehydratedState
  selectedUpdateId?: string
}

export function DefiProjectPage({
  entry,
  sectionLinks,
  versionLinks,
  queryState,
  selectedUpdateId,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(entry.sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
          >
            {!isNavigationEmpty && (
              <StickyMobileSectionNavigation
                sections={navigationSections}
                project={{
                  name: entry.shortName ?? entry.name,
                  icon: entry.icon,
                }}
              />
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={entry}
                    // Ossification keeps DeFi project pages up without the
                    // DeFi section, so there is no index to link to
                    section={env.CLIENT_SIDE_DEFI_ENABLED ? 'defi' : undefined}
                    sectionLinks={sectionLinks}
                    versions={versionLinks}
                  />
                  <ProjectSummaryBars
                    project={{
                      underReviewStatus: entry.isUnderReview
                        ? 'config'
                        : undefined,
                      header: {
                        warning: entry.warnings.yellow,
                        redWarning: entry.warnings.red,
                        emergencyWarning: entry.warnings.emergency,
                      },
                    }}
                    versions={versionLinks}
                  />
                  {entry.badges.length > 0 && (
                    <BadgesSection
                      badges={entry.badges}
                      className="mb-4 md:hidden"
                      withDialog
                    />
                  )}
                  {entry.description && (
                    <AboutSection
                      description={entry.description}
                      className="md:hidden"
                    />
                  )}
                  <HorizontalSeparator
                    className={cn(
                      'my-4 md:hidden',
                      // With an empty summary card, the first section
                      // starts right under this rule, like every later one.
                      !entry.liquidStaking && 'mb-0',
                    )}
                  />
                  <div className="mb-3 max-md:hidden">
                    <DesktopProjectLinks
                      projectLinks={entry.projectLinks}
                      discoUiHref={entry.discoveryHref}
                    />
                  </div>
                </div>

                <div className="row-start-2 w-full">
                  <HighlightableLinkContextProvider>
                    <PrimaryCard
                      id="summary"
                      data-role="nav-section"
                      className={cn(
                        'scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0',
                        // On phones the badges and About sit above the card,
                        // so without the staking summary it collapses to an
                        // empty line that still anchors the Summary tab.
                        !entry.liquidStaking && 'max-md:border-b-0 max-md:p-0',
                      )}
                    >
                      {entry.liquidStaking && (
                        <>
                          <LiquidStakingProjectSummary
                            summary={entry.liquidStaking}
                          />
                          <HorizontalSeparator className="my-4 max-md:hidden" />
                        </>
                      )}
                      <div className="max-md:hidden">
                        <div className="flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
                          {entry.badges.length > 0 && (
                            <BadgesSection badges={entry.badges} withDialog />
                          )}
                          {entry.description && (
                            <AboutSection description={entry.description} />
                          )}
                        </div>
                      </div>
                    </PrimaryCard>
                    <MobileProjectLinks
                      className="border-divider border-b px-4 md:hidden"
                      projectLinks={entry.projectLinks}
                    />

                    <ProjectDetails
                      items={entry.sections}
                      selectedUpdateId={selectedUpdateId}
                    />
                  </HighlightableLinkContextProvider>
                </div>

                {!isNavigationEmpty && (
                  <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
                    <DesktopProjectNavigation
                      project={{
                        title: entry.shortName ?? entry.name,
                        slug: entry.slug,
                        isUnderReview: entry.isUnderReview,
                        icon: entry.icon,
                      }}
                      sections={navigationSections}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

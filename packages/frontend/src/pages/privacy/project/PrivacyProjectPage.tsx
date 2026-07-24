import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { PrivacyProjectRiskProfile } from './components/PrivacyProjectRiskProfile'
import { PrivacyProjectStats } from './components/PrivacyProjectStats'

interface Props extends AppLayoutProps {
  entry: ProjectPrivacyEntry
  queryState: DehydratedState
}

export function PrivacyProjectPage({ entry, queryState, ...props }: Props) {
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
              <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-100 lg:hidden">
                <MobileSectionNavigation sections={navigationSections} />
              </div>
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader project={entry} />
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
                  />
                  {entry.badges && entry.badges.length > 0 && (
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
                  <HorizontalSeparator className="my-4 md:hidden" />
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
                      className="border-divider max-md:rounded-none max-md:border-b max-md:pt-0"
                    >
                      <PrivacyProjectStats
                        totalValueLockedUsd={entry.summary.totalValueLockedUsd}
                        assetsCount={entry.assetsCount}
                        bucketsCount={entry.bucketCount}
                        deposits={entry.summary.deposits}
                      />

                      <PrivacyProjectRiskProfile
                        trustedSetup={entry.trustedSetup}
                        exitWindow={entry.exitWindow}
                        privacy={entry.privacy}
                        reproducibility={entry.reproducibility}
                        className="mt-4"
                      />

                      {entry.attributes.length > 0 && (
                        <ProjectSummaryStat
                          className="mt-6 md:mt-4"
                          title="Attributes"
                          tooltip="Protocol attributes and capabilities."
                          valueClassName="flex flex-wrap justify-start gap-1"
                          value={entry.attributes.map((attribute) => (
                            <PrivacyAttributeTag
                              key={attribute.id}
                              attribute={attribute}
                            />
                          ))}
                        />
                      )}

                      <HorizontalSeparator className="my-4 max-md:hidden" />
                      <div className="max-md:hidden">
                        <div className="flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
                          {entry.badges && entry.badges.length > 0 && (
                            <BadgesSection badges={entry.badges} withDialog />
                          )}
                          {entry.description && (
                            <AboutSection description={entry.description} />
                          )}
                        </div>
                      </div>
                    </PrimaryCard>

                    <ProjectDetails items={entry.sections} />
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
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

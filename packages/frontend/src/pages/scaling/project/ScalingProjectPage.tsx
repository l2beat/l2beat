import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/content-wrapper'
import { OtherMigrationNotice } from '~/components/countdowns/other-migration/other-migration-notice'
import { WhyAmIHereNotice } from '~/components/countdowns/other-migration/why-am-i-here-notice'
import { StageOneRequirementsChangeNotice } from '~/components/countdowns/stage-one-requirements-change/stage-one-requirements-change-notice'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { featureFlags } from '~/consts/feature-flags'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { ProjectScalingSummary } from './_components/scaling-project-summary'

interface Props extends AppLayoutProps {
  projectEntry: ProjectScalingEntry
  queryState: DehydratedState
}

export function ScalingProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.sections,
  )
  const isNavigationEmpty = navigationSections.length === 0
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <div className="smooth-scroll">
            {!isNavigationEmpty && (
              <div className="sticky top-0 z-100 md:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <ProjectScalingSummary project={projectEntry} />
            <ContentWrapper mobileFull>
              {isNavigationEmpty ? (
                <ProjectDetails items={projectEntry.sections} />
              ) : (
                <div className="gap-x-12 md:flex">
                  <div className="mt-10 hidden w-[242px] shrink-0 md:block">
                    <DesktopProjectNavigation
                      project={{
                        title: projectEntry.name,
                        slug: projectEntry.slug,
                        isUnderReview: !!projectEntry.underReviewStatus,
                        icon: projectEntry.icon,
                      }}
                      sections={navigationSections}
                    />
                  </div>
                  <div className="w-full">
                    {projectEntry.countdowns.otherMigration &&
                      !featureFlags.othersMigrated() && (
                        <OtherMigrationNotice
                          {...projectEntry.countdowns.otherMigration}
                        />
                      )}
                    {projectEntry.header.category === 'Other' &&
                      projectEntry.reasonsForBeingOther &&
                      projectEntry.reasonsForBeingOther.length > 0 && (
                        <WhyAmIHereNotice
                          reasons={projectEntry.reasonsForBeingOther}
                        />
                      )}
                    {projectEntry.stageConfig.stage !== 'NotApplicable' &&
                      projectEntry.stageConfig.stage !== 'UnderReview' &&
                      projectEntry.stageConfig.downgradePending && (
                        <StageOneRequirementsChangeNotice
                          downgradePending={
                            projectEntry.stageConfig.downgradePending
                          }
                        />
                      )}
                    <HighlightableLinkContextProvider>
                      <ProjectDetails items={projectEntry.sections} />
                    </HighlightableLinkContextProvider>
                  </div>
                </div>
              )}
            </ContentWrapper>
            <ScrollToTopButton />
          </div>
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/ContentWrapper'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { WarningBar } from '~/components/WarningBar'
import { WhyAmIHereNotice } from '~/components/countdowns/other-migration/WhyAmIHereNotice'
import { StageOneRequirementsChangeNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ArchivedBar } from '~/components/projects/ArchivedBar'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { UnderReviewBar } from '~/components/projects/UnderReviewBar'
import { UpcomingBar } from '~/components/projects/UpcomingBar'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { EmergencyIcon } from '~/icons/Emergency'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { ProjectScalingSummary } from './components/ScalingProjectSummary'

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
        <SideNavLayout>
          <div className="smooth-scroll">
            {!isNavigationEmpty && (
              <div className="sticky top-0 z-100 lg:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <ProjectHeader project={projectEntry} className="mt-[18px] mb-6" />
            <div className="mb-3 max-md:hidden">
              <DesktopProjectLinks
                projectLinks={projectEntry.header.links}
                variant="primary"
                discoUiHref={projectEntry.discoUiHref}
              />
            </div>
            <div className="mb-3 space-y-2">
              {projectEntry.archivedAt && <ArchivedBar />}
              {projectEntry.isUpcoming && <UpcomingBar />}
              {projectEntry.underReviewStatus && (
                <UnderReviewBar
                  text={getUnderReviewText(projectEntry.underReviewStatus)}
                />
              )}
              {projectEntry.header.warning && (
                <WarningBar
                  text={projectEntry.header.warning}
                  color="yellow"
                  className="w-full items-center justify-center p-2.5 text-xs md:text-base"
                />
              )}
              {projectEntry.header.redWarning && (
                <WarningBar
                  text={projectEntry.header.redWarning}
                  color="red"
                  className="w-full items-center justify-center p-2.5 text-xs md:text-base"
                />
              )}
              {projectEntry.header.emergencyWarning && (
                <WarningBar
                  text={projectEntry.header.emergencyWarning}
                  icon={EmergencyIcon}
                  color="yellow"
                  className="w-full items-center justify-center p-2.5 text-xs md:text-base"
                />
              )}
            </div>
            <ContentWrapper mobileFull className="!px-0">
              {isNavigationEmpty ? (
                <ProjectDetails items={projectEntry.sections} />
              ) : (
                <div className="gap-x-6 md:flex">
                  <div className="w-full">
                    <ProjectScalingSummary project={projectEntry} />

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
                  <div className="mt-2 hidden shrink-0 lg:block">
                    <DesktopProjectNavigation
                      project={{
                        title: projectEntry.shortName ?? projectEntry.name,
                        slug: projectEntry.slug,
                        isUnderReview: !!projectEntry.underReviewStatus,
                        icon: projectEntry.icon,
                      }}
                      sections={navigationSections}
                    />
                  </div>
                </div>
              )}
            </ContentWrapper>
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

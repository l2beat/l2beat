import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { WhyAmIHereNotice } from '~/components/countdowns/other-migration/WhyAmIHereNotice'
import { StageOneRequirementsChangeNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
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
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div className="smooth-scroll">
            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <div className="pt-6 max-md:bg-surface-primary max-md:px-4 md:pt-6 lg:pt-[18px]">
              <ProjectHeader
                project={projectEntry}
                ongoingAnomaly={projectEntry.header.ongoingAnomaly}
                className="pb-6"
              />
              <ProjectSummaryBars project={projectEntry} />
              <div className="mb-3 max-md:hidden">
                <DesktopProjectLinks
                  projectLinks={projectEntry.header.links}
                  discoUiHref={projectEntry.discoUiHref}
                />
              </div>
            </div>
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
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

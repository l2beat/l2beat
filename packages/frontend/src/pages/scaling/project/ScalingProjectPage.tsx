import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CssVariables } from '~/components/CssVariables'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { WhyAmIHereNotice } from '~/components/countdowns/other-migration/WhyAmIHereNotice'
import { StageOneRequirementsChangeNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
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
          {projectEntry.colors?.project && (
            <CssVariables
              variables={{
                'project-primary': projectEntry.colors.project?.primary,
                'project-secondary': projectEntry.colors.project?.secondary,
              }}
            />
          )}
          {projectEntry.colors?.ecosystem && (
            <CssVariables
              variables={{
                'ecosystem-primary': projectEntry.colors.ecosystem?.primary,
                'ecosystem-secondary': projectEntry.colors.ecosystem?.secondary,
              }}
            />
          )}
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
            data-has-colors={
              !!projectEntry.colors?.project || !!projectEntry.colors?.ecosystem
            }
          >
            <div className="-z-1 -translate-y-2/5 fixed h-[1440px] w-[900px] translate-x-1/5 rotate-[30deg] bg-radial-[ellipse_closest-side_at_center] from-branding-primary via-25% via-branding-secondary to-transparent max-md:hidden" />

            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileSectionNavigation sections={navigationSections} />
              </div>
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="-z-1 absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-branding-primary/75 to-surface-primary md:hidden" />

              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={projectEntry}
                    ongoingAnomaly={projectEntry.header.ongoingAnomaly}
                  />
                  <ProjectSummaryBars project={projectEntry} />
                  {projectEntry.header.badges && (
                    <BadgesSection
                      badges={projectEntry.header.badges}
                      className="mb-4 md:hidden"
                    />
                  )}
                  {projectEntry.header.description && (
                    <AboutSection
                      description={projectEntry.header.description}
                      className="md:hidden"
                    />
                  )}
                  <HorizontalSeparator className="my-4 md:hidden" />
                  <div className="mb-3 max-md:hidden">
                    <DesktopProjectLinks
                      projectLinks={projectEntry.header.links}
                      discoUiHref={projectEntry.discoUiHref}
                    />
                  </div>
                </div>
                <div className="row-start-2">
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
                {!isNavigationEmpty && (
                  <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
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
                )}
              </div>
              <ScrollToTopButton />
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

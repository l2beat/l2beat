import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/ContentWrapper'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { WarningBar } from '~/components/WarningBar'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
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
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { BridgesMvpWarning } from './components/BridgesMvpWarning'
import { BridgesProjectSummary } from './components/BridgesProjectSummary'

interface Props extends AppLayoutProps {
  projectEntry: BridgesProjectEntry
  queryState: DehydratedState
}

export function BridgesProjectPage({
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
            <BridgesMvpWarning className="w-full" />
            {!isNavigationEmpty && (
              <div className="sticky top-0 z-100 md:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}

            <ProjectHeader project={projectEntry} className="mt-[18px] mb-6" />
            <div className="space-y-2">
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
            </div>
            {projectEntry.header.description && (
              <div className="md:hidden">
                <AboutSection description={projectEntry.header.description} />
              </div>
            )}
            <HorizontalSeparator className="max-md:-mx-4 md:!my-6 my-4 max-md:w-screen md:hidden" />

            <div className="mb-3 max-md:hidden">
              <DesktopProjectLinks
                projectLinks={projectEntry.header.links}
                variant="primary"
                discoUiHref={projectEntry.discoUiHref}
              />
            </div>

            <ContentWrapper mobileFull className="!px-0">
              {isNavigationEmpty ? (
                <ProjectDetails items={projectEntry.sections} />
              ) : (
                <div className="gap-x-6 md:flex">
                  <div className="w-full">
                    <BridgesProjectSummary project={projectEntry} />

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

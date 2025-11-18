import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ProjectZkCatalogSummary } from './components/header/ZkCatalogProjectSummary'

interface Props extends AppLayoutProps {
  projectEntry: ProjectZkCatalogEntry
  queryState: DehydratedState
}

export function ZkCatalogProjectPage({
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
          <div
            className="smooth-scroll group/section-wrapper z-0 max-md:bg-surface-primary"
            data-project-page
          >
            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileSectionNavigation sections={navigationSections} />
              </div>
            )}
            <div className="z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={projectEntry}
                    secondLine={projectEntry.creator}
                  />
                  <ProjectSummaryBars project={projectEntry} />
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
                    />
                  </div>
                </div>
                <div className="row-start-2">
                  <ProjectZkCatalogSummary project={projectEntry} />
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

import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
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
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <div className="z-0 max-md:bg-surface-primary">
              <div className="pt-6 max-md:px-4 lg:w-[calc(100%-196px)] lg:pt-4">
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
              <div className="grid-cols-[1fr_172px] gap-x-6 lg:grid">
                <div>
                  <ProjectZkCatalogSummary project={projectEntry} />
                  <HighlightableLinkContextProvider>
                    <ProjectDetails items={projectEntry.sections} />
                  </HighlightableLinkContextProvider>
                </div>
                {!isNavigationEmpty && (
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

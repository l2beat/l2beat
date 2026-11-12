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
import type { ProjectSection } from '~/components/projects/projectSections'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ZkCatalogSummary } from '~/pages/zk-catalog/v2/project/components/header/ZkCatalogProjectSummary'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { ProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { PrivacyProjectSummaryCard } from './components/PrivacyProjectSummaryCard'

interface Props extends AppLayoutProps {
  entry: ProjectPrivacyEntry
  /** For a privacy protocol that is also in the ZK Catalog. */
  zkCatalog?: {
    creator?: string
    header: ZkCatalogSummary
  }
  projectSections: ProjectSection[]
  versionLinks?: ProjectVersionLinks
  queryState: DehydratedState
  selectedUpdateId?: string
}

export function PrivacyProjectPage({
  entry,
  zkCatalog,
  projectSections,
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
                    sections={projectSections}
                    versions={versionLinks}
                    recentUpdatesCount={entry.recentUpdatesCount}
                    secondLine={
                      // "Railgun by Railgun" says nothing
                      zkCatalog?.creator !== entry.name
                        ? zkCatalog?.creator
                        : undefined
                    }
                  />
                  <ProjectSummaryBars
                    project={{
                      archivedAt: entry.archivedAt,
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
                    <PrivacyProjectSummaryCard
                      entry={entry}
                      zkCatalog={zkCatalog?.header}
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

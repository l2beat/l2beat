import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { ComponentProps, ReactNode } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import type { ProjectSection } from '~/components/projects/projectSections'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'

/** What every project page gets from the server, whatever it is built on. */
export interface ProjectPageCommonProps extends AppLayoutProps {
  projectSections: ProjectSection[]
  versionLinks?: ProjectVersionLinks
  queryState: DehydratedState
  selectedUpdateId?: string
}

interface Props extends ProjectPageCommonProps {
  project: {
    name: string
    shortName?: string
    slug: string
    icon: string
    isUnderReview: boolean
  }
  /** What only some pages show in the title. */
  header?: Pick<
    ComponentProps<typeof ProjectHeader>,
    'ongoingAnomaly' | 'recentUpdatesCount' | 'secondLine'
  >
  /** Under the title: status bars, badges, description, links. */
  intro?: ReactNode
  /** Above the sections: the summary card and notices. */
  summary: ReactNode
  sections: ProjectDetailsSection[]
}

/**
 * The page of a project: its title, summary, sections and their navigation.
 * Each section a page can be built on fills it in with what only it knows.
 */
export function ProjectPage({
  project,
  header,
  intro,
  summary,
  sections,
  projectSections,
  versionLinks,
  queryState,
  selectedUpdateId,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(sections)
  const isNavigationEmpty = navigationSections.length === 0
  const shortName = project.shortName ?? project.name

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
                project={{ name: shortName, icon: project.icon }}
              />
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={project}
                    sections={projectSections}
                    versions={versionLinks}
                    {...header}
                  />
                  {intro}
                </div>
                <div className="row-start-2">
                  <HighlightableLinkContextProvider>
                    {summary}
                    <ProjectDetails
                      items={sections}
                      selectedUpdateId={selectedUpdateId}
                    />
                  </HighlightableLinkContextProvider>
                </div>
                {!isNavigationEmpty && (
                  <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
                    <DesktopProjectNavigation
                      project={{
                        title: shortName,
                        slug: project.slug,
                        isUnderReview: project.isUnderReview,
                        icon: project.icon,
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

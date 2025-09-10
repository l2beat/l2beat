import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ProjectZkCatalogSummary } from './components/ZkCatalogProjectSummary'

interface Props extends AppLayoutProps {
  projectEntry: ProjectZkCatalogEntry
  queryState: DehydratedState
}

export function ZkCatalogProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
          >
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="-z-1 absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-branding-primary/75 to-surface-primary md:hidden" />
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
                </div>
              </div>
            </div>
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

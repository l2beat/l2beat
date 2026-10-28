import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import type { ProjectNavigationSection } from '~/components/projects/navigation/types'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSection } from '~/components/projects/sections/ProjectSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { AuditsProjectDetails } from '~/server/features/audits/types'
import { AuditReportsList } from './components/AuditReportsList'
import { AuditsDisclaimer } from './components/AuditsDisclaimer'
import { AuditsProjectSummary } from './components/AuditsProjectSummary'
import { AuditsTimelineSection } from './components/AuditsTimelineSection'
import { ContractCoverageList } from './components/ContractCoverageList'

interface Props extends AppLayoutProps {
  details: AuditsProjectDetails
  queryState: DehydratedState
}

const SECTIONS = [
  { id: 'audit-timeline', title: 'Audits and upgrades timeline' },
  { id: 'audit-reports', title: 'Audit reports used' },
  { id: 'audit-diff', title: 'Diff from audits' },
] as const

const navigationSections: ProjectNavigationSection[] = [
  { id: 'summary', title: 'Summary' },
  ...SECTIONS,
]

export function AuditsProjectPage({ details, queryState, ...props }: Props) {
  const project = {
    name: details.name,
    slug: details.slug,
    icon: details.icon,
  }
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
          >
            <StickyMobileSectionNavigation sections={navigationSections} />
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={project}
                    secondLine={
                      details.projectHref ? (
                        <>
                          Audit coverage ·{' '}
                          <CustomLink href={details.projectHref}>
                            Project page
                          </CustomLink>
                        </>
                      ) : (
                        'Audit coverage'
                      )
                    }
                  />
                </div>

                <div className="row-start-2 w-full">
                  <PrimaryCard
                    id="summary"
                    data-role="nav-section"
                    className="border-divider max-md:rounded-none max-md:border-b max-md:pt-0"
                  >
                    <AuditsProjectSummary
                      coverage={details.coverage}
                      contracts={details.contracts}
                      fullyCoveredContracts={details.fullyCoveredContracts}
                      discoUiHref={details.discoUiHref}
                    />
                  </PrimaryCard>
                  <ProjectSection
                    id={SECTIONS[0].id}
                    title={SECTIONS[0].title}
                    sectionOrder="1"
                  >
                    <AuditsTimelineSection timeline={details.timeline} />
                  </ProjectSection>
                  <ProjectSection
                    id={SECTIONS[1].id}
                    title={SECTIONS[1].title}
                    sectionOrder="2"
                  >
                    <AuditReportsList
                      reports={details.reports}
                      stackCollectionName={details.stackCollectionName}
                    />
                  </ProjectSection>
                  <ProjectSection
                    id={SECTIONS[2].id}
                    title={SECTIONS[2].title}
                    sectionOrder="3"
                  >
                    <AuditsDisclaimer className="mb-4" />
                    <ContractCoverageList
                      slug={details.slug}
                      contracts={details.contractEntries}
                    />
                  </ProjectSection>
                </div>

                <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
                  <DesktopProjectNavigation
                    project={{
                      title: details.shortName ?? details.name,
                      slug: details.slug,
                      isUnderReview: false,
                      icon: details.icon,
                    }}
                    sections={navigationSections}
                  />
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

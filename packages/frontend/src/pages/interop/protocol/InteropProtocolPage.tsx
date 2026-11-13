import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import type { ProjectSection } from '~/components/projects/projectSections'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import type { InteropProtocolDashboardData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import type { ProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { InteropEntityPageLayout } from '../components/InteropEntityPageLayout'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import type { InteropSelection } from '../utils/types'
import { InteropProtocolSummary } from './components/InteropProtocolSummary'

interface Props extends AppLayoutProps {
  projectEntry: InteropProtocolEntry
  /**
   * For a protocol that is also a chain, like Avalanche: the chain's flows,
   * shown in place of the protocol's own volume. They cover every protocol,
   * this one included (its canonical bridge button picks it).
   */
  chainFlows?: Extract<ProjectDetailsSection, { type: 'InteropFlowsSection' }>
  projectSections: ProjectSection[]
  versionLinks?: ProjectVersionLinks
  protocolData: InteropProtocolDashboardData
  apiSelection: InteropSelection
  selectedUpdateId?: string
  queryState: DehydratedState
}

export function InteropProtocolPage({
  projectEntry,
  chainFlows,
  projectSections,
  versionLinks,
  apiSelection,
  protocolData,
  selectedUpdateId,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <Content
          projectEntry={
            chainFlows ? withChainFlows(projectEntry, chainFlows) : projectEntry
          }
          projectSections={projectSections}
          versionLinks={versionLinks}
          apiSelection={apiSelection}
          protocolData={protocolData}
          selectedUpdateId={selectedUpdateId}
        />
      </HydrationBoundary>
    </AppLayout>
  )
}

function withChainFlows(
  entry: InteropProtocolEntry,
  chainFlows: NonNullable<Props['chainFlows']>,
): InteropProtocolEntry {
  return {
    ...entry,
    sections: [
      chainFlows,
      ...entry.sections.filter(
        (section) => section.type !== 'InteropVolumeSection',
      ),
    ],
  }
}

function Content({
  projectEntry,
  projectSections,
  versionLinks,
  apiSelection,
  protocolData,
  selectedUpdateId,
}: {
  projectEntry: InteropProtocolEntry
  projectSections: ProjectSection[]
  versionLinks?: ProjectVersionLinks
  apiSelection: InteropSelection
  protocolData: InteropProtocolDashboardData
  selectedUpdateId?: string
}) {
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.sections,
  )
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <InteropEntityPageLayout
      navigationSections={navigationSections}
      isNavigationEmpty={isNavigationEmpty}
      navigationProject={{
        title: projectEntry.shortName ?? projectEntry.name,
        slug: projectEntry.slug,
        isUnderReview: !!projectEntry.underReviewStatus,
        icon: projectEntry.icon,
      }}
      header={
        <>
          <ProjectHeader
            project={projectEntry}
            sections={projectSections}
            versions={versionLinks}
            recentUpdatesCount={projectEntry.header.recentUpdatesCount}
          />
          <ProjectSummaryBars project={projectEntry} versions={versionLinks} />
          {projectEntry.header?.description && (
            <AboutSection
              description={projectEntry.header.description}
              className="md:hidden"
            />
          )}
          <HorizontalSeparator className="my-4 md:hidden" />
          <div className="max-md:hidden">
            <DesktopProjectLinks
              projectLinks={projectEntry.header.links ?? []}
              discoUiHref={projectEntry.header.discoUiHref}
            />
          </div>
        </>
      }
    >
      <InteropProtocolSummary
        protocol={projectEntry}
        apiSelection={apiSelection}
        protocolData={protocolData}
      />
      {projectEntry.header.links && projectEntry.header.links?.length > 0 && (
        <div className="border-divider border-b px-4 md:hidden">
          <MobileProjectLinks projectLinks={projectEntry.header.links} />
        </div>
      )}
      <TopTokenWidget
        className="md:mt-4"
        topToken={protocolData.topToken}
        isLoading={false}
        hideProtocol
        hideChainsInfo
        apiSelection={apiSelection}
      />

      <HighlightableLinkContextProvider>
        <ProjectDetails
          items={projectEntry.sections}
          selectedUpdateId={selectedUpdateId}
        />
      </HighlightableLinkContextProvider>
    </InteropEntityPageLayout>
  )
}

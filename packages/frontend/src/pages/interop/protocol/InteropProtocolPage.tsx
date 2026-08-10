import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { InteropEntityPageLayout } from '../components/InteropEntityPageLayout'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import type { InteropSelection } from '../utils/types'
import { InteropProtocolSummary } from './components/InteropProtocolSummary'

interface Props extends AppLayoutProps {
  projectEntry: InteropProtocolEntry
  protocolData: InteropProtocolDashboardData
  apiSelection: InteropSelection
  selectedUpdateId?: string
}

export function InteropProtocolPage({
  projectEntry,
  apiSelection,
  protocolData,
  selectedUpdateId,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <Content
        projectEntry={projectEntry}
        apiSelection={apiSelection}
        protocolData={protocolData}
        selectedUpdateId={selectedUpdateId}
      />
    </AppLayout>
  )
}

function Content({
  projectEntry,
  apiSelection,
  protocolData,
  selectedUpdateId,
}: {
  projectEntry: InteropProtocolEntry
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
            recentUpdatesCount={projectEntry.header.recentUpdatesCount}
          />
          <ProjectSummaryBars project={projectEntry} />
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

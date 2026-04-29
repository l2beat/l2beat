import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
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
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import type { InteropSelection } from '../utils/types'
import { InteropProtocolSummary } from './components/InteropProtocolSummary'
import { getInteropProtocolSections } from './getInteropProtocolSections'

interface Props extends AppLayoutProps {
  projectEntry: InteropProtocolEntry
  protocolData: InteropProtocolDashboardData
  interopChains: InteropChainWithIcon[]
  apiSelection: InteropSelection
}

export function InteropProtocolPage({
  projectEntry,
  interopChains,
  apiSelection,
  protocolData,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <Content
        projectEntry={projectEntry}
        interopChains={interopChains}
        apiSelection={apiSelection}
        protocolData={protocolData}
      />
    </AppLayout>
  )
}

function Content({
  projectEntry,
  interopChains,
  apiSelection,
  protocolData,
}: {
  projectEntry: InteropProtocolEntry
  interopChains: InteropChainWithIcon[]
  apiSelection: InteropSelection
  protocolData: InteropProtocolDashboardData
}) {
  const sections = getInteropProtocolSections({
    projectId: projectEntry.id,
    protocolData,
    apiSelection,
    interopChains,
  })
  const navigationSections = projectDetailsToNavigationSections(sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <SideNavLayout childrenWrapperClassName="md:pt-0">
      {!isNavigationEmpty && (
        <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-40 lg:hidden">
          <MobileSectionNavigation sections={navigationSections} />
        </div>
      )}
      <div className="relative z-0 max-md:bg-surface-primary">
        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          <div className="pt-6 max-md:px-4 lg:pt-4">
            <ProjectHeader project={projectEntry} />
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
          </div>
          <div className="row-start-2">
            <InteropProtocolSummary
              protocol={projectEntry}
              apiSelection={apiSelection}
              protocolData={protocolData}
            />
            <div className="border-divider border-b px-4 md:hidden">
              <MobileProjectLinks
                projectLinks={projectEntry.header.links ?? []}
              />
            </div>
            <TopTokenWidget
              className="md:mt-4"
              topToken={protocolData.topToken}
              isLoading={false}
              hideProtocol
              hideChainsInfo
            />

            <HighlightableLinkContextProvider>
              <ProjectDetails items={sections} />
            </HighlightableLinkContextProvider>
          </div>
          {!isNavigationEmpty && (
            <div className="row-start-2 mt-4 hidden shrink-0 lg:block">
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
    </SideNavLayout>
  )
}

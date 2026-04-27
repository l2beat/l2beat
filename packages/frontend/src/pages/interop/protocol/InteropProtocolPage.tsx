import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import {
  DesktopProjectNavigation,
  DesktopProjectNavigationSkeleton,
} from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ProjectSectionSkeleton } from '~/components/projects/sections/ProjectSectionSkeleton'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { api } from '~/trpc/React'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InitialChainSelector } from '../components/InitialChainSelector'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropMode, InteropSelection } from '../utils/types'
import { InteropProtocolSummary } from './components/InteropProtocolSummary'
import { TopToken } from './components/TopToken'
import { getInteropProtocolSections } from './getInteropProtocolSections'

interface Props extends AppLayoutProps {
  mode: InteropMode
  projectEntry: InteropProtocolEntry
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

export function InteropProtocolPage({
  mode,
  projectEntry,
  interopChains,
  onboardingInteropChains,
  initialSelection,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider
          mode={mode}
          interopChains={interopChains}
          initialSelection={initialSelection}
        >
          <Content
            mode={mode}
            projectEntry={projectEntry}
            interopChains={interopChains}
            onboardingInteropChains={onboardingInteropChains}
          />
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Content({
  mode,
  projectEntry,
  interopChains,
  onboardingInteropChains,
}: {
  mode: InteropMode
  projectEntry: InteropProtocolEntry
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
}) {
  const { selectedChains, selectChain, selectionForApi, isDirty, reset } =
    useInteropSelectedChains()
  const showInitialChainSelector =
    mode === 'public' &&
    (selectedChains.from.length !== 1 || selectedChains.to.length !== 1)
  const hasApiSelection =
    selectionForApi.from.length > 0 && selectionForApi.to.length > 0
  const shouldFetchProtocol = !showInitialChainSelector && hasApiSelection
  const { data, isLoading } = api.interop.protocol.useQuery(
    {
      ...selectionForApi,
      id: projectEntry.id,
    },
    {
      enabled: shouldFetchProtocol,
    },
  )
  const showEmptyState =
    !showInitialChainSelector &&
    (!hasApiSelection || (!isLoading && !data?.entry))
  const showSectionSkeletons = shouldFetchProtocol && isLoading
  const sections = getInteropProtocolSections({
    projectId: projectEntry.id,
    hasSelection: shouldFetchProtocol,
    isLoading,
    data,
  })
  const navigationSections = projectDetailsToNavigationSections(sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <SideNavLayout childrenWrapperClassName="md:pt-0">
      {!isNavigationEmpty && !showInitialChainSelector && (
        <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-40 lg:hidden">
          <MobileSectionNavigation sections={navigationSections} />
        </div>
      )}
      <div className="relative z-0 max-md:bg-surface-primary">
        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          {!showInitialChainSelector && (
            <ChainSelector
              chains={interopChains}
              protocols={undefined}
              className="top-10 md:hidden"
            />
          )}
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
            {showInitialChainSelector ? (
              <div className="mt-3">
                <InitialChainSelector
                  interopChains={onboardingInteropChains}
                  selectedChains={selectedChains}
                  selectChain={selectChain}
                  type={undefined}
                />
              </div>
            ) : (
              <>
                <ChainSelector
                  chains={interopChains}
                  protocols={undefined}
                  className="max-md:hidden"
                />
                {!showEmptyState ? (
                  <>
                    <InteropProtocolSummary protocol={projectEntry} />
                    <div className="border-divider border-b px-4 md:hidden">
                      <MobileProjectLinks
                        projectLinks={projectEntry.header.links ?? []}
                      />
                    </div>
                    <TopToken id={projectEntry.id} />

                    {showSectionSkeletons ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <ProjectSectionSkeleton key={i} variant={i} />
                      ))
                    ) : (
                      <HighlightableLinkContextProvider>
                        <ProjectDetails items={sections} />
                      </HighlightableLinkContextProvider>
                    )}
                  </>
                ) : (
                  <InteropEmptyState
                    className="h-[calc(100vh-500px)] md:h-[calc(100vh-300px)]"
                    showResetButton={mode === 'internal' && isDirty}
                    onResetButtonClick={reset}
                  />
                )}
              </>
            )}
          </div>
          {(showSectionSkeletons || !isNavigationEmpty) && (
            <div className="row-start-2 mt-4 hidden shrink-0 lg:block">
              {showSectionSkeletons ? (
                <DesktopProjectNavigationSkeleton />
              ) : (
                <DesktopProjectNavigation
                  project={{
                    title: projectEntry.shortName ?? projectEntry.name,
                    slug: projectEntry.slug,
                    isUnderReview: !!projectEntry.underReviewStatus,
                    icon: projectEntry.icon,
                  }}
                  sections={navigationSections}
                />
              )}
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </SideNavLayout>
  )
}

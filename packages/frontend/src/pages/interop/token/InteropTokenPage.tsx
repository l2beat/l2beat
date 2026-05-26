import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import type { ProjectNavigationSection } from '~/components/projects/navigation/types'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSection } from '~/components/projects/sections/ProjectSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropTokenDashboardData } from '~/server/features/scaling/interop/getInteropTokenData'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { AllProtocolsTable } from '../components/table/AllProtocolsTable'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { InteropTokenSummary } from './components/InteropTokenSummary'
import { TokenTopProtocolCard } from './components/TokenTopProtocolCard'
import { TokenTransfersSection } from './components/TokenTransfersSection'
import { TokenVolumeSection } from './components/TokenVolumeSection'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  token: {
    id: string
    slug: string
    symbol: string
    issuer: string | null
    iconUrl: string
    category: string | null
  }
  interopChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

const navigationSections: ProjectNavigationSection[] = [
  { id: 'summary', title: 'Summary' },
  { id: 'interop-volume', title: 'Volume and flows' },
  { id: 'interop-tokens', title: 'Top protocols' },
  { id: 'interop-transfers', title: 'Transfers' },
]

export function InteropTokenPage({
  queryState,
  token,
  interopChains,
  initialSelection,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider
          mode="public"
          interopChains={interopChains}
          initialSelection={initialSelection}
        >
          <Content token={token} interopChains={interopChains} />
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Content({
  token,
  interopChains,
}: {
  token: Props['token']
  interopChains: InteropChainWithIcon[]
}) {
  const { selectionForApi, isDirty, reset } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.tokenDashboard.useQuery({
    tokenId: token.id,
    ...selectionForApi,
  })
  return (
    <SideNavLayout childrenWrapperClassName="md:pt-0">
      <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-40 lg:hidden">
        <MobileSectionNavigation sections={navigationSections} />
      </div>
      <div className="relative z-0 max-md:bg-surface-primary">
        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          <div className="pt-6 max-md:px-4 lg:pt-4">
            <ProjectHeader
              project={{
                name: token.symbol,
                slug: token.slug,
                icon: token.iconUrl,
              }}
              secondLine={
                token.issuer ? `Issued by ${token.issuer}` : undefined
              }
            />
            <HorizontalSeparator className="my-4 md:hidden" />
          </div>
          <div className="row-start-2">
            {data === null ? (
              <InteropEmptyState
                showResetButton={isDirty}
                onResetButtonClick={reset}
              />
            ) : (
              <TokenDetails
                data={data as InteropTokenDashboardData | undefined}
                isLoading={isLoading}
                tokenId={token.id}
                tokenCategory={token.category}
                interopChains={interopChains}
                apiSelection={selectionForApi}
              />
            )}
          </div>
          <div className="row-start-2 mt-4 hidden shrink-0 lg:block">
            <DesktopProjectNavigation
              project={{
                title: token.symbol,
                slug: token.slug,
                isUnderReview: false,
                icon: token.iconUrl,
              }}
              sections={navigationSections}
            />
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </SideNavLayout>
  )
}

function TokenDetails({
  data,
  isLoading,
  tokenId,
  tokenCategory,
  interopChains,
  apiSelection,
}: {
  data: InteropTokenDashboardData | undefined
  isLoading: boolean
  tokenId: string
  tokenCategory: string | null
  interopChains: InteropChainWithIcon[]
  apiSelection: InteropSelection
}) {
  return (
    <>
      <InteropTokenSummary
        data={data}
        isLoading={isLoading}
        tokenCategory={tokenCategory}
        apiSelection={apiSelection}
      />
      <TokenTopProtocolCard
        data={data}
        isLoading={isLoading}
        apiSelection={apiSelection}
      />
      <HighlightableLinkContextProvider>
        <TokenVolumeSection
          tokenId={tokenId}
          data={data}
          interopChains={interopChains}
          sectionOrder="1"
        />
        <ProjectSection
          id="interop-tokens"
          title="Top protocols"
          sectionOrder="2"
        >
          {data?.entries && data.entries.length > 0 && (
            <AllProtocolsTable
              type={undefined}
              entries={data.entries}
              hideTypeColumn
              hideTokensColumn
            />
          )}
          {!isLoading && (!data?.entries || data.entries.length === 0) && (
            <div className="rounded-lg bg-surface-secondary px-4 py-3 font-medium text-label-value-14 text-secondary">
              No protocol data for this token.
            </div>
          )}
        </ProjectSection>
        <TokenTransfersSection
          sectionOrder="3"
          tokenId={tokenId}
          data={data}
          interopChains={interopChains}
          apiSelection={apiSelection}
        />
      </HighlightableLinkContextProvider>
    </>
  )
}

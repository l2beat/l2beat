import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropTokenDashboardData } from '~/server/features/scaling/interop/getInteropTokenData'
import type { InteropTokenEntry } from '~/server/features/scaling/interop/token/getInteropTokenEntry'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { InteropTokenSummary } from './components/InteropTokenSummary'
import { TokenTopProtocolCard } from './components/TokenTopProtocolCard'
import {
  InteropTokenDashboardProvider,
  useInteropTokenDashboard,
} from './InteropTokenDashboardContext'

interface Props extends AppLayoutProps {
  token: {
    id: string
    slug: string
    symbol: string
    issuer: string | null
    iconUrl: string
    category: string | null
  }
  tokenEntry: InteropTokenEntry
  tokenData: InteropTokenDashboardData | null
  apiSelection: InteropSelection
  interopChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

export function InteropTokenPage({
  token,
  tokenEntry,
  tokenData,
  apiSelection,
  interopChains,
  initialSelection,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <InteropSelectedChainsProvider
        mode="public"
        interopChains={interopChains}
        initialSelection={initialSelection}
      >
        <Content
          token={token}
          tokenEntry={tokenEntry}
          tokenData={tokenData}
          apiSelection={apiSelection}
        />
      </InteropSelectedChainsProvider>
    </AppLayout>
  )
}

function Content({
  token,
  tokenEntry,
  tokenData,
  apiSelection,
}: {
  token: Props['token']
  tokenEntry: InteropTokenEntry
  tokenData: InteropTokenDashboardData | null
  apiSelection: InteropSelection
}) {
  const { selectionForApi, isDirty, reset } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.tokenDashboard.useQuery(
    {
      tokenId: token.id,
      ...selectionForApi,
    },
    {
      initialData: isSameSelection(selectionForApi, apiSelection)
        ? tokenData
        : undefined,
    },
  )

  const navigationSections =
    data === null ? [] : projectDetailsToNavigationSections(tokenEntry.sections)
  const isNavigationEmpty = navigationSections.length <= 1

  if (data === null) {
    return (
      <PageLayout
        token={token}
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
      >
        <InteropEmptyState
          showResetButton={isDirty}
          onResetButtonClick={reset}
        />
      </PageLayout>
    )
  }

  return (
    <InteropTokenDashboardProvider
      data={data}
      isLoading={isLoading}
      apiSelection={selectionForApi}
      tokenId={token.id}
    >
      <PageLayout
        token={token}
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
      >
        <TokenPageContent token={token} tokenEntry={tokenEntry} />
      </PageLayout>
    </InteropTokenDashboardProvider>
  )
}

function TokenPageContent({
  token,
  tokenEntry,
}: {
  token: Props['token']
  tokenEntry: InteropTokenEntry
}) {
  const { data, isLoading, apiSelection } = useInteropTokenDashboard()

  return (
    <>
      <InteropTokenSummary
        data={data}
        isLoading={isLoading}
        tokenCategory={token.category}
        apiSelection={apiSelection}
      />
      <TokenTopProtocolCard
        data={data}
        isLoading={isLoading}
        apiSelection={apiSelection}
      />
      <HighlightableLinkContextProvider>
        <ProjectDetails items={tokenEntry.sections} />
      </HighlightableLinkContextProvider>
    </>
  )
}

function PageLayout({
  token,
  navigationSections,
  isNavigationEmpty,
  children,
}: {
  token: Props['token']
  navigationSections: ReturnType<typeof projectDetailsToNavigationSections>
  isNavigationEmpty: boolean
  children: ReactNode
}) {
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
          <div className="row-start-2">{children}</div>
          {!isNavigationEmpty && (
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
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </SideNavLayout>
  )
}

function isSameSelection(left: InteropSelection, right: InteropSelection) {
  return (
    left.from.length === right.from.length &&
    left.to.length === right.to.length &&
    left.from.every((value, index) => value === right.from[index]) &&
    left.to.every((value, index) => value === right.to[index])
  )
}

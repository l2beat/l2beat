import { useQuery } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import { useTRPC } from '~/trpc/React'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropEntityPageLayout } from '../components/InteropEntityPageLayout'
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
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.tokenDashboard.queryOptions(
      {
        tokenId: token.id,
        ...selectedChains,
      },
      {
        initialData: isSameSelection(selectedChains, apiSelection)
          ? tokenData
          : undefined,
      },
    ),
  )

  const navigationSections =
    data === null ? [] : projectDetailsToNavigationSections(tokenEntry.sections)
  const isNavigationEmpty = navigationSections.length <= 1

  const navigationProject = {
    title: token.symbol,
    slug: token.slug,
    isUnderReview: false,
    icon: token.iconUrl,
  }
  const header = (
    <>
      <ProjectHeader
        className="mb-0 md:mb-4"
        project={{
          name: token.symbol,
          slug: token.slug,
          icon: token.iconUrl,
        }}
        secondLine={token.issuer ? `Issued by ${token.issuer}` : undefined}
      />
      <HorizontalSeparator className="my-4 md:hidden" />
    </>
  )

  if (data === null) {
    return (
      <InteropEntityPageLayout
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
        navigationProject={navigationProject}
        header={header}
      >
        <InteropEmptyState />
      </InteropEntityPageLayout>
    )
  }

  return (
    <InteropTokenDashboardProvider
      data={data}
      isLoading={isLoading}
      apiSelection={selectedChains}
      tokenId={token.id}
    >
      <InteropEntityPageLayout
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
        navigationProject={navigationProject}
        header={header}
      >
        <TokenPageContent token={token} tokenEntry={tokenEntry} />
      </InteropEntityPageLayout>
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
        deploymentsCount={tokenEntry.deploymentsCount}
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

function isSameSelection(left: InteropSelection, right: InteropSelection) {
  return (
    left.from.length === right.from.length &&
    left.to.length === right.to.length &&
    left.from.every((value, index) => value === right.from[index]) &&
    left.to.every((value, index) => value === right.to[index])
  )
}

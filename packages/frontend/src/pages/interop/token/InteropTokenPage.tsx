import { useQuery } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { WarningBar } from '~/components/WarningBar'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import { useTRPC } from '~/trpc/React'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropEntityPageLayout } from '../components/InteropEntityPageLayout'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { InteropTokenSummary } from './components/InteropTokenSummary'
import { TokenTopProtocolCard } from './components/TokenTopProtocolCard'
import { getInteropTokenNotices } from './getInteropTokenNotices'
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
    isPriceUnreliable: boolean
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
        secondLine={
          token.issuer ? (
            <>
              Issued by <span className="capitalize">{token.issuer}</span>
            </>
          ) : undefined
        }
      />
      <HorizontalSeparator className="my-4 md:hidden" />
    </>
  )

  const notices = data === undefined ? [] : getInteropTokenNotices(token, data)

  // Without any aggregates there is nothing to show beyond the token itself.
  if (data === null) {
    return (
      <InteropEntityPageLayout
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
        navigationProject={navigationProject}
        header={header}
      >
        <InteropTokenNotices notices={notices} />
        <InteropTokenSummary
          data={null}
          isLoading={false}
          tokenCategory={token.category}
          isPriceUnreliable={token.isPriceUnreliable}
          deploymentsCount={tokenEntry.deploymentsCount}
        />
      </InteropEntityPageLayout>
    )
  }

  return (
    <InteropTokenDashboardProvider
      data={data}
      isLoading={isLoading}
      apiSelection={selectedChains}
      tokenId={token.id}
      isPriceUnreliable={token.isPriceUnreliable}
    >
      <InteropEntityPageLayout
        navigationSections={navigationSections}
        isNavigationEmpty={isNavigationEmpty}
        navigationProject={navigationProject}
        header={header}
      >
        <InteropTokenNotices notices={notices} />
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
  const { data, isLoading, apiSelection, isPriceUnreliable } =
    useInteropTokenDashboard()

  return (
    <>
      <InteropTokenSummary
        data={data}
        isLoading={isLoading}
        tokenCategory={token.category}
        isPriceUnreliable={isPriceUnreliable}
        deploymentsCount={tokenEntry.deploymentsCount}
      />
      <TokenTopProtocolCard
        data={data}
        isLoading={isLoading}
        apiSelection={apiSelection}
        isPriceUnreliable={isPriceUnreliable}
      />
      <HighlightableLinkContextProvider>
        <ProjectDetails items={tokenEntry.sections} />
      </HighlightableLinkContextProvider>
    </>
  )
}

function InteropTokenNotices({ notices }: { notices: string[] }) {
  if (notices.length === 0) return null

  return (
    <div className="mt-4 flex flex-col gap-2 max-md:px-4">
      {notices.map((notice) => (
        <WarningBar key={notice} color="yellow" text={notice} ignoreMarkdown />
      ))}
    </div>
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

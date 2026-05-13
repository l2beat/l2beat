import partition from 'lodash/partition'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectSection } from '~/components/projects/sections/ProjectSection'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsChainsSelector } from '~/pages/interop/components/flows/FlowsChainsSelector'
import { FlowsGeneralStats } from '~/pages/interop/components/flows/FlowsGeneralStats'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import { InactiveChainsDialog } from '~/pages/interop/components/flows/graph/InactiveChainsDialog'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropTokenDashboardData } from '~/server/features/scaling/interop/getInteropTokenData'
import { api } from '~/trpc/React'

export function TokenVolumeSection({
  tokenId,
  data,
  interopChains,
  sectionOrder,
}: {
  tokenId: string
  data: InteropTokenDashboardData | undefined
  interopChains: InteropChainWithIcon[]
  sectionOrder: string
}) {
  const protocols = data?.entries ?? []
  const sortedChains = sortChainsByFlowVolume(interopChains, data?.flows ?? [])
  const defaultSelectedChains = sortedChains
    .slice(0, 15)
    .map((chain) => chain.id)

  return (
    <ProjectSection
      id="interop-volume"
      title="Volume and flows"
      sectionOrder={sectionOrder}
    >
      <InteropFlowsProvider
        chains={sortedChains}
        protocols={protocols}
        defaultSelectedChains={defaultSelectedChains}
      >
        <Content tokenId={tokenId} interopChains={sortedChains} />
      </InteropFlowsProvider>
    </ProjectSection>
  )
}

function Content({
  tokenId,
  interopChains,
}: {
  tokenId: string
  interopChains: InteropChainWithIcon[]
}) {
  const { selectedChains, selectedProtocols, highlightedChains } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS
  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
      tokenId,
    },
    { enabled: hasEnoughChains && hasEnoughProtocols },
  )

  const activeIds = new Set<string>(
    (data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  )
  const [activeChains, inactiveChains] = partition(
    interopChains.filter((chain) => selectedChains.includes(chain.id)),
    (chain) => activeIds.has(chain.id),
  )

  const shouldShowInactiveChainsInfo =
    !!data && inactiveChains.length > 0 && !isLoading

  const visibleHighlightedChains = isLoading
    ? highlightedChains
    : highlightedChains.filter((chainId) => activeIds.has(chainId))
  const chainA = interopChains.find((c) => c.id === visibleHighlightedChains[0])
  const chainB =
    visibleHighlightedChains.length === 2
      ? interopChains.find((c) => c.id === visibleHighlightedChains[1])
      : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto">
        <FlowsChainsSelector allChains={interopChains} />
      </div>
      <FlowsGraphPanel
        activeChains={activeChains}
        data={data}
        hasEnoughChains={hasEnoughChains}
        hasEnoughProtocols={hasEnoughProtocols}
        isLoading={isLoading}
        baseDollarsPerParticle={25}
      />
      {shouldShowInactiveChainsInfo && (
        <div className="flex min-h-6 w-full items-center justify-center gap-1 max-lg:order-3">
          {isLoading ? (
            <Skeleton className="h-4 w-40 md:h-5" />
          ) : (
            <>
              <span className="font-normal text-secondary text-xs leading-none md:text-base">
                No transfers detected for
              </span>
              <InactiveChainsDialog chains={inactiveChains} />
            </>
          )}
        </div>
      )}
      <FlowsGeneralStats
        tokenId={tokenId}
        title="Token stats"
        description="For past 24h between the selected chains and protocols"
        hideTokenStats
        className="max-lg:order-3"
      />
      {chainA && (
        <div className="grid grid-cols-1 gap-2 max-lg:order-3 md:grid-cols-2 md:grid-rows-2 md:[&>*:first-child]:row-span-2">
          {visibleHighlightedChains.length === 1 && (
            <SingleChainStats
              chainId={chainA.id}
              selectedChains={selectedChains}
              tokenId={tokenId}
              hideTopProtocols
            />
          )}
          {visibleHighlightedChains.length === 2 && chainB && (
            <MultipleChainsStats
              chainIdA={chainA.id}
              chainIdB={chainB.id}
              selectedChains={selectedChains}
              tokenId={tokenId}
              hideTopProtocols
            />
          )}
        </div>
      )}
    </div>
  )
}

function sortChainsByFlowVolume(
  chains: InteropChainWithIcon[],
  flows: InteropTokenDashboardData['flows'],
): InteropChainWithIcon[] {
  const volumePerChain = new Map<string, number>()
  for (const flow of flows) {
    volumePerChain.set(
      flow.srcChain,
      (volumePerChain.get(flow.srcChain) ?? 0) + flow.volume,
    )
    volumePerChain.set(
      flow.dstChain,
      (volumePerChain.get(flow.dstChain) ?? 0) + flow.volume,
    )
  }
  return chains.toSorted(
    (a, b) => (volumePerChain.get(b.id) ?? 0) - (volumePerChain.get(a.id) ?? 0),
  )
}

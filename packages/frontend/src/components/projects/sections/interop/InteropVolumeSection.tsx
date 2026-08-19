import { useQuery } from '@tanstack/react-query'
import partition from 'lodash/partition'
import { Skeleton } from '~/components/core/Skeleton'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE,
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsChainsSelector } from '~/pages/interop/components/flows/FlowsChainsSelector'
import { FlowsParticleLegend } from '~/pages/interop/components/flows/FlowsParticleLegend'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import { InactiveChainsDialog } from '~/pages/interop/components/flows/graph/InactiveChainsDialog'
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import { useTRPC } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  entry: ProtocolEntry
  interopChains: InteropChainWithIcon[]
  defaultSelectedChains: string[]
}

export function InteropVolumeSection({
  entry,
  interopChains,
  defaultSelectedChains,
  ...sectionProps
}: InteropVolumeSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <InteropFlowsProvider
        chains={interopChains}
        protocols={[entry]}
        defaultSelectedChains={defaultSelectedChains}
      >
        <Content interopChains={interopChains} />
      </InteropFlowsProvider>
    </ProjectSection>
  )
}

function Content({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const trpc = useTRPC()
  const { selectedChains, selectedProtocols, highlightedChains } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS
  const { data, isLoading } = useQuery(
    trpc.interop.flows.queryOptions(
      {
        chains: selectedChains,
        protocolIds: selectedProtocols,
      },
      { enabled: hasEnoughChains && hasEnoughProtocols },
    ),
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

  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
    EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE,
  )

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
        baseDollarsPerParticle={EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE}
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
      {!isLoading && data && (
        <FlowsParticleLegend
          className="max-lg:order-3"
          totalVolume={data.stats.totalVolume}
          dollarsPerParticle={dollarsPerParticle}
        />
      )}
      {chainA && (
        <div className="grid grid-cols-1 gap-2 max-lg:order-3 lg:grid-cols-4 lg:[&>*:first-child]:row-span-3 lg:[&>*]:col-span-2">
          {visibleHighlightedChains.length === 1 && (
            <SingleChainStats
              chainId={chainA.id}
              selectedChains={selectedChains}
              hideTopProtocols
            />
          )}
          {visibleHighlightedChains.length === 2 && chainB && (
            <MultipleChainsStats
              chainIdA={chainA.id}
              chainIdB={chainB.id}
              selectedChains={selectedChains}
              hideTopProtocols
            />
          )}
        </div>
      )}
    </div>
  )
}

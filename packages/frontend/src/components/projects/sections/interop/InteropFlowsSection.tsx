import { useQuery } from '@tanstack/react-query'
import partition from 'lodash/partition'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE,
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsCanonicalBridgeButton } from '~/pages/interop/components/flows/FlowsCanonicalBridgeButton'
import { FlowsChainsSelector } from '~/pages/interop/components/flows/FlowsChainsSelector'
import { FlowsParticleLegend } from '~/pages/interop/components/flows/FlowsParticleLegend'
import { FlowsProtocolsSelector } from '~/pages/interop/components/flows/FlowsProtocolsSelector'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import { InactiveChainsDialog } from '~/pages/interop/components/flows/graph/InactiveChainsDialog'
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { useTRPC } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ExploreInteropButton } from './ExploreInteropButton'
import { FlowsStatsPanel } from './FlowsStatsPanel'
import { InteropBridgeSubsections } from './InteropBridgeSubsections'

export interface InteropFlowsSectionProps extends ProjectSectionProps {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
  defaultSelectedChains: string[]
  defaultStatsChainId: string
  canonicalProtocolId?: string
}

export function InteropFlowsSection({
  interopChains,
  protocols,
  defaultSelectedChains,
  defaultStatsChainId,
  canonicalProtocolId,
  ...sectionProps
}: InteropFlowsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      headerAccessory={<ExploreInteropButton className="max-md:hidden" />}
    >
      <InteropFlowsProvider
        chains={interopChains}
        protocols={protocols}
        defaultSelectedChains={defaultSelectedChains}
        pinnedChainId={defaultStatsChainId}
      >
        <Content
          interopChains={interopChains}
          protocols={protocols}
          defaultStatsChainId={defaultStatsChainId}
          canonicalProtocolId={canonicalProtocolId}
        />
      </InteropFlowsProvider>
      <div className="mt-4 md:hidden">
        <ExploreInteropButton />
      </div>
    </ProjectSection>
  )
}

function Content({
  interopChains,
  protocols,
  defaultStatsChainId,
  canonicalProtocolId,
}: Pick<
  InteropFlowsSectionProps,
  'interopChains' | 'protocols' | 'defaultStatsChainId' | 'canonicalProtocolId'
>) {
  const trpc = useTRPC()
  const { highlightedChains, selectedChains, selectedProtocols } =
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
  const activeIds = new Set<string>([
    ...(data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  ])
  const [activeChains, inactiveChains] = partition(
    interopChains.filter((chain) => selectedChains.includes(chain.id)),
    (chain) => activeIds.has(chain.id),
  )

  const visibleHighlightedChains = highlightedChains.filter((chainId) =>
    activeIds.has(chainId),
  )
  const hasGraphSelection = visibleHighlightedChains.length > 0
  const showInactiveChainsInfo = !!data && inactiveChains.length > 0
  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
    EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE,
  )
  const statsChainA = visibleHighlightedChains[0] ?? defaultStatsChainId
  const statsChainB = visibleHighlightedChains[1]
  const hasRouteSelection = hasGraphSelection && !!statsChainB

  const detailChains = useMemo(
    () =>
      hasRouteSelection && statsChainB
        ? [statsChainA, statsChainB]
        : selectedChains,
    [hasRouteSelection, statsChainB, statsChainA, selectedChains],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-start">
        <div className="flex gap-2 max-md:w-full md:contents">
          <FlowsChainsSelector allChains={interopChains} />
          <FlowsProtocolsSelector
            allProtocols={protocols}
            canonicalProtocolId={canonicalProtocolId}
          />
        </div>
        {canonicalProtocolId && (
          <FlowsCanonicalBridgeButton
            allProtocols={protocols}
            canonicalProtocolId={canonicalProtocolId}
          />
        )}
      </div>
      <div className="flex h-full min-w-0 flex-col">
        <div className="group/flows flex h-full w-full min-w-0 flex-col items-center gap-10 pb-4">
          <FlowsGraphPanel
            activeChains={activeChains}
            data={data}
            hasEnoughChains={hasEnoughChains}
            hasEnoughProtocols={hasEnoughProtocols}
            isLoading={isLoading}
            topChainId={defaultStatsChainId}
          />
        </div>
        {!isLoading && data && (
          <FlowsParticleLegend
            layout="inline"
            className="mt-2 justify-center text-center text-label-value-13"
            totalVolume={data.stats.totalVolume}
            dollarsPerParticle={dollarsPerParticle}
          />
        )}
        {(isLoading || showInactiveChainsInfo) && (
          <div className="mt-10 flex min-h-6 w-full items-center justify-center gap-1 max-lg:order-2">
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
      </div>
      <FlowsStatsPanel
        data={data}
        protocols={protocols}
        canonicalProtocolId={canonicalProtocolId}
        statsChainA={statsChainA}
        statsChainB={statsChainB}
        hasRouteSelection={hasRouteSelection}
      />
      <InteropBridgeSubsections
        protocolIds={selectedProtocols}
        chains={detailChains}
        anchorChain={statsChainA}
      />
    </div>
  )
}

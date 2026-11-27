import { useQuery } from '@tanstack/react-query'
import partition from 'lodash/partition'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectIconList } from '~/components/ProjectIconList'
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
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
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
  const activeIds = new Set<string>(
    (data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  )
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
    <div className="@container flex flex-col gap-4">
      {/* One row only where all three filters fit with every icon shown, so
          the row never wraps when the chosen chains or protocols change.
          From lg to xl the protocols selector hides its icons, so they fit. */}
      <div className="flex @min-[800px]:flex-row flex-col gap-3 md:items-start lg:max-xl:flex-row">
        <div className="flex @min-[800px]:contents gap-2 max-md:w-full lg:max-xl:contents">
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
      {/* Stats sit beside the graph when the section has room, so a click on
          the graph changes something the reader can see. */}
      <div className="grid @min-[720px]:grid-cols-[minmax(0,1fr)_300px] @min-[880px]:grid-cols-[minmax(0,1fr)_340px] grid-cols-1 @min-[720px]:items-start gap-4">
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
          {/* Both lines keep their space while loading or when empty, so
              the section's height doesn't follow the selection. */}
          <FlowsParticleLegend
            layout="inline"
            className={cn(
              'mt-2 justify-center text-center text-label-value-13',
              !data && 'invisible',
            )}
            totalVolume={data?.stats.totalVolume ?? 0}
            // The hidden copy needs both parts to wrap like the loaded one.
            dollarsPerParticle={
              data ? dollarsPerParticle : EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE
            }
          />
          {/* Fits two lines of chain names, or the icon list's 44px touch target. */}
          <div className="mt-4 flex min-h-7 not-can-hover:min-h-11 w-full items-center justify-center gap-1.5 max-lg:order-2">
            {isLoading ? (
              <Skeleton className="h-4 w-40 md:h-5" />
            ) : (
              showInactiveChainsInfo && (
                <>
                  <span className="text-label-value-13 text-secondary">
                    No transfers in the last 24 hours for
                    {inactiveChains.length <= 3 &&
                      ` ${inactiveChains.map((chain) => chain.name).join(', ')}`}
                  </span>
                  {inactiveChains.length > 3 && (
                    <ProjectIconList
                      projects={inactiveChains}
                      title="Chains without transfers"
                    />
                  )}
                </>
              )
            )}
          </div>
        </div>
        <FlowsStatsPanel
          data={data}
          protocols={protocols}
          canonicalProtocolId={canonicalProtocolId}
          statsChainA={statsChainA}
          statsChainB={statsChainB}
          hasRouteSelection={hasRouteSelection}
          isLoading={isLoading}
        />
      </div>
      <InteropBridgeSubsections
        protocolIds={selectedProtocols}
        chains={detailChains}
        anchorChain={statsChainA}
      />
    </div>
  )
}

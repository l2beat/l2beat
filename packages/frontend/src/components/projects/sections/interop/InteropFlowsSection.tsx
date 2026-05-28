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
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ExploreInteropButton } from './ExploreInteropButton'

export interface InteropFlowsSectionProps extends ProjectSectionProps {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
  defaultSelectedChains: string[]
  defaultStatsChainId: string
}

export function InteropFlowsSection({
  interopChains,
  protocols,
  defaultSelectedChains,
  defaultStatsChainId,
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
          defaultStatsChainId={defaultStatsChainId}
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
  defaultStatsChainId,
}: Pick<InteropFlowsSectionProps, 'interopChains' | 'defaultStatsChainId'>) {
  const { highlightedChains, selectedChains, selectedProtocols } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS
  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
    },
    { enabled: hasEnoughChains && hasEnoughProtocols },
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
  const shouldRenderInactiveChainsInfo = hasEnoughChains && hasEnoughProtocols
  const shouldShowInactiveChainsInfo =
    !!data && inactiveChains.length > 0 && !isLoading
  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
    EMBEDDED_FLOWS_DOLLARS_PER_PARTICLE,
  )
  const statsChainA = visibleHighlightedChains[0] ?? defaultStatsChainId
  const statsChainB = visibleHighlightedChains[1]
  const hasRouteSelection = hasGraphSelection && !!statsChainB

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <FlowsChainsSelector allChains={interopChains} />
        {!isLoading && data && (
          <FlowsParticleLegend
            layout="inline"
            className="justify-end text-right text-label-value-13"
            totalVolume={data.stats.totalVolume}
            dollarsPerParticle={dollarsPerParticle}
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
        {shouldRenderInactiveChainsInfo && (
          <div className="mt-3 flex min-h-6 w-full items-center justify-center gap-1 pt-1 max-lg:order-2">
            {shouldShowInactiveChainsInfo ? (
              <>
                <span className="font-normal text-secondary text-xs leading-none md:text-base">
                  No transfers detected for
                </span>
                <InactiveChainsDialog chains={inactiveChains} />
              </>
            ) : isLoading ? (
              <Skeleton className="h-4 w-40 md:h-5" />
            ) : null}
          </div>
        )}
      </div>
      <div className="rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
        <div className="mb-3 font-bold text-label-value-12 text-secondary uppercase">
          {hasRouteSelection ? 'Route stats' : 'Chain stats'}
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:[&>*:first-child]:row-span-3 lg:[&>*]:col-span-2">
          {hasRouteSelection ? (
            <MultipleChainsStats
              chainIdA={statsChainA}
              chainIdB={statsChainB}
              selectedChains={selectedChains}
              linkTopProtocols
            />
          ) : (
            <SingleChainStats
              chainId={statsChainA}
              selectedChains={selectedChains}
              linkTopProtocols
            />
          )}
        </div>
      </div>
    </div>
  )
}

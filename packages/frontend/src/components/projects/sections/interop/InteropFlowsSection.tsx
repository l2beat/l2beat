import { UnixTime } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { Skeleton } from '~/components/core/Skeleton'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsChainsSelector } from '~/pages/interop/components/flows/FlowsChainsSelector'
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
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

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
    <ProjectSection {...sectionProps}>
      <InteropFlowsProvider
        chains={interopChains}
        protocols={protocols}
        defaultSelectedChains={defaultSelectedChains}
        defaultHighlightedChains={[defaultStatsChainId]}
        lockedChainIds={[defaultStatsChainId]}
      >
        <Content
          interopChains={interopChains}
          defaultStatsChainId={defaultStatsChainId}
        />
      </InteropFlowsProvider>
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
    25,
  )
  const avgValuePerSecond = (data?.stats.totalVolume ?? 0) / UnixTime.DAY
  const statsChainA = visibleHighlightedChains[0] ?? defaultStatsChainId
  const statsChainB = visibleHighlightedChains[1]
  const hasRouteSelection = hasGraphSelection && !!statsChainB

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <FlowsChainsSelector allChains={interopChains} />
        {!isLoading && data && (
          <div className="flex items-center justify-end gap-2 text-right font-medium text-label-value-13 text-secondary">
            <span>
              Avg value per second ≈{' '}
              <span className="font-bold text-brand">
                {formatCurrency(avgValuePerSecond, 'usd')}
              </span>
            </span>
            {dollarsPerParticle && (
              <>
                <span className="text-secondary">|</span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-brand" />1 particle
                  ≈{' '}
                  <span className="font-bold text-brand">
                    {formatCurrency(dollarsPerParticle, 'usd')}/s
                  </span>
                </span>
              </>
            )}
          </div>
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
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

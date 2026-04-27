import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { Skeleton } from '~/components/core/Skeleton'
import { FlowsChainsSelector } from '~/pages/interop/components/flows/FlowsChainsSelector'
import { MIN_SELECTED_CHAINS } from '~/pages/interop/components/flows/consts'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import { useScaledParticleCounts } from '~/pages/interop/components/flows/graph/utils/useScaledParticleCounts'
import { InactiveChainsDialog } from '~/pages/interop/components/flows/graph/InactiveChainsDialog'
import { FlowsSelectedPathPanel } from '~/pages/interop/components/flows/selection-panel/FlowsSelectedPathPanel'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

export function InteropVolumeSection({
  projectId,
  ...sectionProps
}: InteropVolumeSectionProps) {
  const { allChainIds, getChainById } = useInteropSelectedChains()
  const interopChains = allChainIds
    .map((chainId) => getChainById(chainId))
    .filter((chain): chain is InteropChainWithIcon => chain !== undefined)

  return (
    <ProjectSection {...sectionProps}>
      <InteropFlowsProvider
        chains={interopChains}
        protocols={[{ id: projectId, name: '', iconUrl: '' }]}
      >
        <ProtocolFlowsContent />
      </InteropFlowsProvider>
    </ProjectSection>
  )
}

function ProtocolFlowsContent() {
  const { allChains, highlightedChains, selectedChains, selectedProtocols } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
    },
    {
      enabled: hasEnoughChains && selectedProtocols.length > 0,
    },
  )

  const activeIds = new Set(
    (data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  )
  const [activeChains, inactiveChains] = partition(
    allChains.filter((chain) => selectedChains.includes(chain.id)),
    (chain) => activeIds.has(chain.id),
  )
  const visibleHighlightedChains = isLoading
    ? highlightedChains
    : highlightedChains.filter((chainId) => activeIds.has(chainId))
  const showInactiveInfo = !!data && inactiveChains.length > 0 && !isLoading
  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
  )
  const avgValuePerSecond = (data?.stats.totalVolume ?? 0) / UnixTime.DAY

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start">
        <FlowsChainsSelector allChains={allChains} />
      </div>

      <div className="rounded-lg bg-surface-primary p-4">
        <FlowsGraphPanel
          activeChains={activeChains}
          data={data}
          hasEnoughChains={hasEnoughChains}
          hasEnoughProtocols={selectedProtocols.length > 0}
          isLoading={isLoading}
        />
        <div className="mt-2 flex min-h-6 items-center justify-center gap-1">
          {showInactiveInfo ? (
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
        <div className="mt-2 space-y-1 text-center font-medium text-label-value-14 text-secondary">
          {isLoading ? (
            <Skeleton className="mx-auto h-5 w-52" />
          ) : (
            <>
              {dollarsPerParticle && (
                <div className="flex items-center justify-center gap-1">
                  <div className="size-1.5 rounded-full bg-brand" />1 particle
                  ≈{' '}
                  <span className="font-bold text-brand">
                    {formatCurrency(dollarsPerParticle, 'usd', {
                      decimals: 0,
                    })}
                  </span>
                </div>
              )}
              <div>
                Avg value per second ≈{' '}
                <span className="font-bold text-brand">
                  {formatCurrency(avgValuePerSecond, 'usd')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          'transition-opacity duration-200',
          visibleHighlightedChains.length > 0 ? 'opacity-100' : 'opacity-60',
        )}
      >
        {visibleHighlightedChains.length > 0 ? (
          <FlowsSelectedPathPanel
            visibleHighlightedChains={visibleHighlightedChains}
            showDetailsButton={false}
          />
        ) : (
          <div className="rounded-lg border border-divider bg-surface-secondary px-4 py-3 font-medium text-secondary text-xs dark:bg-header-secondary">
            Select one or two chains on the chart to view protocol-specific path
            statistics.
          </div>
        )}
      </div>
    </div>
  )
}

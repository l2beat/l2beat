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
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  data: InteropProtocolDashboardData
  interopChains: InteropChainWithIcon[]
  defaultSelectedChains: string[]
}

export function InteropVolumeSection({
  data,
  interopChains,
  defaultSelectedChains,
  ...sectionProps
}: InteropVolumeSectionProps) {
  const entry = data.entry
  if (!entry) return null

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
  const { selectedChains, selectedProtocols, highlightedChains } =
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

  const activeIds = new Set<string>(
    (data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  )
  const [activeChains, inactiveChains] = partition(
    interopChains.filter((chain) => selectedChains.includes(chain.id)),
    (chain) => activeIds.has(chain.id),
  )

  const shouldRenderInactiveChainsInfo = hasEnoughChains && hasEnoughProtocols
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
    25,
  )
  const avgValuePerSecond = (data?.stats.totalVolume ?? 0) / UnixTime.DAY

  return (
    <div className="flex flex-col items-center gap-4">
      <FlowsChainsSelector allChains={interopChains} />
      <FlowsGraphPanel
        activeChains={activeChains}
        data={data}
        hasEnoughChains={hasEnoughChains}
        hasEnoughProtocols={hasEnoughProtocols}
        isLoading={isLoading}
        baseDollarsPerParticle={25}
      />
      {shouldRenderInactiveChainsInfo && (
        <div className="flex min-h-6 w-full items-center justify-center gap-1 max-lg:order-3">
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
      {!isLoading && data && (
        <div className="space-y-1 text-center font-medium text-label-value-14 text-secondary max-lg:order-3">
          {dollarsPerParticle && (
            <div className="flex items-center justify-center gap-1">
              <div className="size-1.5 rounded-full bg-brand" />1 particle ≈{' '}
              <span className="font-bold text-brand">
                {formatCurrency(dollarsPerParticle, 'usd', { decimals: 0 })}
              </span>
            </div>
          )}
          <div>
            Avg value per second ≈{' '}
            <span className="font-bold text-brand">
              {formatCurrency(avgValuePerSecond, 'usd')}
            </span>
          </div>
        </div>
      )}
      {chainA && (
        <div className="grid grid-cols-1 gap-2 max-lg:order-3 md:grid-cols-2">
          {visibleHighlightedChains.length === 1 && (
            <SingleChainStats
              chainId={chainA.id}
              selectedChains={selectedChains}
            />
          )}
          {visibleHighlightedChains.length === 2 && chainB && (
            <MultipleChainsStats
              chainIdA={chainA.id}
              chainIdB={chainB.id}
              selectedChains={selectedChains}
            />
          )}
        </div>
      )}
    </div>
  )
}

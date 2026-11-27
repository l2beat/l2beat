import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import { StatsCardHeader } from '~/pages/interop/components/flows/selection-panel/StatsCardHeader'
import { useInteropFlows } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'
import { cn } from '~/utils/cn'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { BridgeFlowStats } from './BridgeFlowStats'

interface FlowsStatsPanelProps {
  data: InteropFlowsData | undefined
  protocols: (ProtocolDisplayable & { id: string })[]
  canonicalProtocolId: string | undefined
  statsChainA: string
  statsChainB: string | undefined
  hasRouteSelection: boolean
  isLoading: boolean
}

// On phones the sub-cards join into one stack split by dividers.
const CARDS_GRID_CLASS_NAME =
  'grid @min-[640px]:grid-cols-2 grid-cols-1 gap-2 max-sm:gap-0 @min-[640px]:[&>*:first-child]:row-span-3 max-sm:[&>*:not(:first-child)]:rounded-t-none max-sm:[&>*:not(:first-child)]:border-t-0 max-sm:[&>*:not(:last-child)]:rounded-b-none'
const CARD_CLASS_NAME =
  'rounded-lg border border-divider bg-surface-primary px-4 py-3'

export function FlowsStatsPanel({
  data,
  protocols,
  canonicalProtocolId,
  statsChainA,
  statsChainB,
  hasRouteSelection,
  isLoading,
}: FlowsStatsPanelProps) {
  const { allChains, selectedChains, selectedProtocols } = useInteropFlows()
  const singleProtocolId =
    selectedProtocols.length === 1 ? selectedProtocols[0] : undefined

  const label = getStatsLabel({
    interopChains: allChains,
    protocols,
    canonicalProtocolId,
    selectedProtocols,
    singleProtocolId,
    statsChainA,
    statsChainB,
    hasRouteSelection,
  })

  return (
    // The placeholder and the stats share one grid cell, so the panel is
    // always as tall as the tallest view, chain stats. Picking a route, a
    // bridge or other chains doesn't change the section's height.
    <div className="@container grid *:[grid-area:1/1]">
      <StatsPlaceholder isLoading={isLoading} />
      <div>
        <div className="mb-2.5 text-balance font-bold text-label-value-14 uppercase leading-5">
          {label}
        </div>
        {isLoading ? null : singleProtocolId && !hasRouteSelection ? (
          data && <BridgeFlowStats data={data} chainId={statsChainA} />
        ) : (
          <div className={CARDS_GRID_CLASS_NAME}>
            {hasRouteSelection && statsChainB ? (
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
        )}
      </div>
    </div>
  )
}

/** The chain stats' layout with every row filled: hidden, or a skeleton while loading. */
function StatsPlaceholder({ isLoading }: { isLoading: boolean }) {
  return (
    <div aria-hidden className={cn(!isLoading && 'invisible')}>
      <div className="invisible mb-2.5 font-bold text-label-value-14 uppercase leading-5">
        Chain stats
      </div>
      <div className={CARDS_GRID_CLASS_NAME}>
        <div className={CARD_CLASS_NAME}>
          <StatsCardHeader />
          {/* Chain stats show at most 12 rows, and each list at most 3. */}
          <PlaceholderRows count={12} isLoading={isLoading} />
        </div>
        {['Top routes', 'Top tokens', 'Top bridges'].map((title) => (
          <div key={title} className={CARD_CLASS_NAME}>
            <div className="mb-2 font-bold text-label-value-12 uppercase">
              {title}
            </div>
            <PlaceholderRows count={3} isLoading={isLoading} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderRows({
  count,
  isLoading,
}: {
  count: number
  isLoading: boolean
}) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex h-4 justify-between gap-2">
          {/* No skeletons while hidden: their pulse would still restyle. */}
          {isLoading && (
            <>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function getStatsLabel({
  interopChains,
  protocols,
  canonicalProtocolId,
  selectedProtocols,
  singleProtocolId,
  statsChainA,
  statsChainB,
  hasRouteSelection,
}: {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & { id: string })[]
  canonicalProtocolId: string | undefined
  selectedProtocols: string[]
  singleProtocolId: string | undefined
  statsChainA: string
  statsChainB: string | undefined
  hasRouteSelection: boolean
}): ReactNode {
  const chainName = (chainId: string | undefined) =>
    interopChains.find((c) => c.id === chainId)?.name ?? chainId ?? ''

  // The icon, not a "↔" glyph: Roboto draws that as a hairline next to bold caps.
  const baseLabel = hasRouteSelection ? (
    <>
      {chainName(statsChainA)}{' '}
      {/* Keeps the arrow on the line of the chain it points to. */}
      <span className="whitespace-nowrap">
        <BidirectionalArrowIcon
          aria-hidden
          className="mr-1 inline size-3.5 fill-current align-[-0.125em]"
        />
        <span className="sr-only">{' and '}</span>
        {chainName(statsChainB)}
      </span>{' '}
      route{'\u00a0'}stats
    </>
  ) : (
    'Chain stats'
  )

  if (selectedProtocols.length === protocols.length) {
    return baseLabel
  }

  const protocolSuffix =
    singleProtocolId !== undefined
      ? singleProtocolId === canonicalProtocolId
        ? 'Canonical bridge'
        : (protocols.find((p) => p.id === singleProtocolId)?.name ?? 'protocol')
      : `${selectedProtocols.length} protocols`

  return (
    <>
      {baseLabel}
      {DOT_SEPARATOR}
      {protocolSuffix}
    </>
  )
}

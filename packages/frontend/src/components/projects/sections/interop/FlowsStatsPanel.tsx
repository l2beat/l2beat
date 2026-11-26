import type { ReactNode } from 'react'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import { useInteropFlows } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { BridgeFlowStats } from './BridgeFlowStats'

interface FlowsStatsPanelProps {
  data: InteropFlowsData | undefined
  protocols: (ProtocolDisplayable & { id: string })[]
  canonicalProtocolId: string | undefined
  statsChainA: string
  statsChainB: string | undefined
  hasRouteSelection: boolean
}

export function FlowsStatsPanel({
  data,
  protocols,
  canonicalProtocolId,
  statsChainA,
  statsChainB,
  hasRouteSelection,
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
    <div className="@container">
      <div className="mb-2.5 text-balance font-bold text-label-value-14 uppercase leading-5">
        {label}
      </div>
      {singleProtocolId && !hasRouteSelection ? (
        data && <BridgeFlowStats data={data} chainId={statsChainA} />
      ) : (
        <div className="grid @min-[640px]:grid-cols-2 grid-cols-1 gap-2 max-sm:gap-0 @min-[640px]:[&>*:first-child]:row-span-3 max-sm:[&>*:not(:first-child)]:rounded-t-none max-sm:[&>*:not(:first-child)]:border-t-0 max-sm:[&>*:not(:last-child)]:rounded-b-none">
          {/* On phones the sub-cards join into one stack split by dividers. */}
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

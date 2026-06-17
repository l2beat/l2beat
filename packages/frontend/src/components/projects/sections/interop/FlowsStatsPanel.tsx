import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { BridgeFlowStats } from './BridgeFlowStats'

interface FlowsStatsPanelProps {
  data: InteropFlowsData | undefined
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & { id: string })[]
  canonicalProtocolId: string | undefined
  selectedProtocols: string[]
  selectedChains: string[]
  singleProtocolId: string | undefined
  statsChainA: string
  statsChainB: string | undefined
  hasRouteSelection: boolean
}

export function FlowsStatsPanel({
  data,
  interopChains,
  protocols,
  canonicalProtocolId,
  selectedProtocols,
  selectedChains,
  singleProtocolId,
  statsChainA,
  statsChainB,
  hasRouteSelection,
}: FlowsStatsPanelProps) {
  const label = getStatsLabel({
    interopChains,
    protocols,
    canonicalProtocolId,
    selectedProtocols,
    singleProtocolId,
    statsChainA,
    statsChainB,
    hasRouteSelection,
  })

  return (
    <div className="rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="mb-3 font-bold text-label-value-12 text-secondary uppercase">
        {label}
      </div>
      {singleProtocolId && !hasRouteSelection ? (
        data && <BridgeFlowStats data={data} chainId={statsChainA} />
      ) : (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:[&>*:first-child]:row-span-3 lg:[&>*]:col-span-2">
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
}: Omit<FlowsStatsPanelProps, 'data' | 'selectedChains'>): string {
  const chainName = (chainId: string | undefined) =>
    interopChains.find((c) => c.id === chainId)?.name ?? chainId ?? ''

  const baseLabel = hasRouteSelection
    ? `${chainName(statsChainA)} <> ${chainName(statsChainB)} route stats`
    : 'Chain stats'

  if (selectedProtocols.length === protocols.length) {
    return baseLabel
  }

  const protocolSuffix =
    singleProtocolId !== undefined
      ? singleProtocolId === canonicalProtocolId
        ? 'Canonical bridge'
        : (protocols.find((p) => p.id === singleProtocolId)?.name ?? 'protocol')
      : `${selectedProtocols.length} protocols`

  return `${baseLabel} · ${protocolSuffix}`
}

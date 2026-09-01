import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MultipleChainsStats } from '~/pages/interop/components/flows/selection-panel/MultipleChainsStats'
import { SingleChainStats } from '~/pages/interop/components/flows/selection-panel/SingleChainStats'
import { useInteropFlows } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'
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
}: {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & { id: string })[]
  canonicalProtocolId: string | undefined
  selectedProtocols: string[]
  singleProtocolId: string | undefined
  statsChainA: string
  statsChainB: string | undefined
  hasRouteSelection: boolean
}): string {
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

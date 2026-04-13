import { useInteropFlows } from '../utils/InteropFlowsContext'
import { MultipleChainsStats } from './MultipleChainsStats'
import { SingleChainStats } from './SingleChainStats'

export function FlowsSelectedPathPanel() {
  const { allChains, highlightedChains, selectedChains } = useInteropFlows()
  const chainA = allChains.find((c) => c.id === highlightedChains[0])
  const chainB =
    highlightedChains.length === 2
      ? allChains.find((c) => c.id === highlightedChains[1])
      : undefined

  if (!chainA) {
    return null
  }

  const title =
    highlightedChains.length === 1
      ? `${chainA.name} <> All supported chains`
      : `${chainA.name} <> ${chainB?.name}`

  const detailsUrl = buildDetailsUrl(highlightedChains)

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4">
      <div className="font-bold text-heading-20">Selected path</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        {title}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 md:max-lg:grid-cols-2">
        {highlightedChains.length === 1 && (
          <SingleChainStats
            chainId={chainA.id}
            selectedChains={selectedChains}
          />
        )}
        {highlightedChains.length === 2 && chainB && (
          <MultipleChainsStats
            chainIdA={chainA.id}
            chainIdB={chainB.id}
            selectedChains={selectedChains}
          />
        )}
      </div>
      {highlightedChains.length === 2 && chainB && (
        <div className="mt-auto pt-4">
          <a
            href={detailsUrl}
            className="block w-full rounded-lg bg-brand py-2.5 text-center font-bold text-label-value-14 text-primary-invert transition-colors hover:bg-brand/90"
          >
            View path details
          </a>
        </div>
      )}
    </div>
  )
}

function buildDetailsUrl(graphSelectedChains: string[]): string {
  const params = new URLSearchParams()
  if (graphSelectedChains.length > 0) {
    params.set('selectedChains', graphSelectedChains.join(','))
  }
  return `/interop/summary?${params.toString()}`
}

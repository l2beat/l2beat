import { Button } from '~/components/core/Button'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
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

  const detailsUrl = buildInteropUrl(
    '/interop/summary',
    {
      from: [chainA.id],
      to: chainB ? [chainB.id] : [],
    },
    'public',
  )

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="font-bold text-heading-20">Selected path</div>
      <div className="mt-1 flex items-center gap-1 font-medium text-label-value-14 text-secondary">
        <span>{chainA.name}</span>
        <BidirectionalArrowIcon className="size-3.5 fill-secondary" />
        <span>{chainB?.name ?? 'All supported chains'}</span>
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
        <a href={detailsUrl}>
          <Button variant="fill" className="mt-5 w-full">
            View path details
          </Button>
        </a>
      )}
    </div>
  )
}

import { pluralize } from '@l2beat/shared-pure'
import { Button } from '~/components/core/Button'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { MultipleChainsStats } from './MultipleChainsStats'
import { SingleChainStats } from './SingleChainStats'

export function FlowsSelectedPathPanel({
  visibleHighlightedChains,
}: {
  visibleHighlightedChains: string[]
}) {
  const { allChains, selectedChains } = useInteropFlows()
  const chainA = allChains.find((c) => c.id === visibleHighlightedChains[0])
  const chainB =
    visibleHighlightedChains.length === 2
      ? allChains.find((c) => c.id === visibleHighlightedChains[1])
      : undefined

  const selectedChainsLabel = `${selectedChains.length - 1} selected ${pluralize(selectedChains.length - 1, 'chain')}`
  if (!chainA) {
    return null
  }

  const cta = chainB
    ? {
        label: 'View path details',
        href: buildInteropUrl('/interop/summary', {
          from: [chainA.id, chainB.id],
          to: [chainA.id, chainB.id],
        }),
      }
    : visibleHighlightedChains.length === 1 && chainA.href
      ? {
          label: 'View chain details',
          href: `${chainA.href}#interop-flows`,
        }
      : undefined

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="font-bold text-heading-20">Selected path</div>
      <div className="mt-1 flex items-center gap-1 font-medium text-label-value-14 text-secondary">
        <span>{chainA.name}</span>
        <BidirectionalArrowIcon className="size-3.5 fill-secondary" />
        <span>{chainB?.name ?? selectedChainsLabel}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 md:max-lg:grid-cols-2">
        {visibleHighlightedChains.length === 1 && (
          <SingleChainStats
            chainId={chainA.id}
            selectedChains={selectedChains}
            linkTopProtocols
          />
        )}
        {visibleHighlightedChains.length === 2 && chainB && (
          <MultipleChainsStats
            chainIdA={chainA.id}
            chainIdB={chainB.id}
            selectedChains={selectedChains}
            linkTopProtocols
          />
        )}
      </div>
      {cta && (
        <a href={cta.href}>
          <Button variant="fill" className="mt-5 w-full">
            {cta.label}
          </Button>
        </a>
      )}
    </div>
  )
}

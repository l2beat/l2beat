import { pluralize } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import { useInteropSelectedChains } from '../utils/InteropSelectedChainsContext'

export function BetweenChainsInfo({
  additionalText,
  className,
}: {
  className?: string
  additionalText?: string
}) {
  const { selectedChains, getChainById } = useInteropSelectedChains()
  const fromChainId =
    selectedChains.from.length === 1 ? selectedChains.from[0] : undefined
  const toChainId =
    selectedChains.to.length === 1 ? selectedChains.to[0] : undefined
  const fromChain = fromChainId ? getChainById(fromChainId) : undefined
  const toChain = toChainId ? getChainById(toChainId) : undefined
  const isSinglePair =
    selectedChains.from.length === 1 && selectedChains.to.length === 1

  return (
    <div
      className={cn(
        'flex items-center gap-1 font-medium text-label-value-12 text-secondary leading-none md:text-label-value-14',
        className,
      )}
    >
      {isSinglePair ? (
        <>
          <span>Between</span>
          {fromChain && <img src={fromChain.iconUrl} className="size-4" />}
          <span>&</span>
          {toChain && <img src={toChain.iconUrl} className="size-4" />}
        </>
      ) : (
        <span>
          Between {selectedChains.from.length}{' '}
          {pluralize(selectedChains.from.length, 'source chain')} and{' '}
          {selectedChains.to.length}{' '}
          {pluralize(selectedChains.to.length, 'destination chain')}
        </span>
      )}
      {additionalText && <span>{additionalText}</span>}
    </div>
  )
}

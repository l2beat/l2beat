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
  const { selectedChains } = useInteropSelectedChains()
  const isSinglePair =
    selectedChains.from.length === 1 &&
    selectedChains.to.length === 1 &&
    selectedChains.first &&
    selectedChains.second

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
          {selectedChains.first && (
            <img src={selectedChains.first.iconUrl} className="size-4" />
          )}
          <span>&</span>
          {selectedChains.second && (
            <img src={selectedChains.second.iconUrl} className="size-4" />
          )}
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

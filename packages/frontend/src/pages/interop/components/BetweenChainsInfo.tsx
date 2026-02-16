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

  return (
    <div
      className={cn(
        'flex items-center gap-1 font-medium text-label-value-12 text-secondary leading-none md:text-label-value-14',
        className,
      )}
    >
      <span>Between</span>
      {selectedChains.first && (
        <img src={selectedChains.first.iconUrl} className="size-4" />
      )}
      <span>&</span>
      {selectedChains.second && (
        <img src={selectedChains.second.iconUrl} className="size-4" />
      )}
      {additionalText && <span>{additionalText}</span>}
    </div>
  )
}

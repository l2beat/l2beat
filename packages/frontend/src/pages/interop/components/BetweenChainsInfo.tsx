import { cn } from '~/utils/cn'
import { useInteropSelectedChains } from '../utils/InteropSelectedChainsContext'

export function BetweenChainsInfo({
  additionalText,
  className,
}: {
  className?: string
  additionalText?: string
}) {
  const { selectedChainsIcons } = useInteropSelectedChains()
  const [chain1, chain2] = selectedChainsIcons

  return (
    <div
      className={cn(
        'flex items-center gap-1 font-medium text-label-value-12 text-secondary leading-none md:text-label-value-14',
        className,
      )}
    >
      <span>Between</span>
      {chain1 && <img src={chain1} className="size-4" />}
      <span>&</span>
      {chain2 && <img src={chain2} className="size-4" />}
      {additionalText && <span>{additionalText}</span>}
    </div>
  )
}

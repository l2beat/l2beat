import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/format-number'

interface Props {
  isDescendant: boolean
  isPreminted: boolean
  amount: string
}

export function TokenCanonicalAmountCell({
  amount,
  isPreminted,
  isDescendant,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'text-xs font-medium',
          isDescendant && 'text-black/80 dark:text-white/80',
        )}
      >
        {formatNumberWithCommas(Number(amount))}
      </TooltipTrigger>
      <TooltipContent>
        {isPreminted
          ? 'The lower value between circulating supply and the value locked in the escrow'
          : 'Tokens locked in the escrow'}
      </TooltipContent>
    </Tooltip>
  )
}

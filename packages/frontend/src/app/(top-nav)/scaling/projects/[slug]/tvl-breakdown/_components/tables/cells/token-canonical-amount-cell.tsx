import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { WarningBar } from '~/components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/format-number'

interface Props {
  isDescendant: boolean
  isPreminted: boolean
  amount: number
  warnings: string[]
}

export function TokenCanonicalAmountCell({
  amount,
  isPreminted,
  isDescendant,
  warnings,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'flex w-full items-center justify-end gap-1 text-xs font-medium',
          isDescendant && 'text-black/80 dark:text-white/80',
        )}
      >
        {warnings.length > 0 && (
          <RoundedWarningIcon className="size-4" sentiment="neutral" />
        )}
        {formatNumberWithCommas(Number(amount))}
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-2">
          <span>
            {isPreminted
              ? 'The lower value between circulating supply and the value locked in the escrow'
              : 'Tokens locked in the escrow'}
          </span>
          {warnings.map((warning, i) => (
            <WarningBar
              key={`amount-warning-${i}`}
              icon={RoundedWarningIcon}
              text={warning}
              color="gray"
            />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

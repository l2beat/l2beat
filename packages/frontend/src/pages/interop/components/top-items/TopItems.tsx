import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { TopItem } from './columns'

type InteropTopItemsCellProps = {
  topItems: TopItems<TopItem>
  setIsOpen: (isOpen: boolean) => void
  iconClassName?: string
  renderRemainingCount?: (remainingCount: number) => React.ReactNode
}

export function InteropTopItems({
  topItems,
  setIsOpen,
  iconClassName,
  renderRemainingCount,
  className,
  ...rest
}: InteropTopItemsCellProps & React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'group/dialog-trigger grid grid-cols-[46px_30px] items-center gap-1',
        className,
      )}
      onClick={() => setIsOpen(true)}
      {...rest}
    >
      <div className="-space-x-1.5 flex items-center">
        {topItems.items.map((item, i) => (
          <ItemIconWithTooltip
            key={item.id}
            item={item}
            index={i}
            className={iconClassName}
          />
        ))}
      </div>
      {topItems.remainingCount > 0 &&
        (renderRemainingCount?.(topItems.remainingCount) ?? (
          <span className="font-bold text-label-value-13 group-hover/dialog-trigger:underline">
            +{topItems.remainingCount}
          </span>
        ))}
    </button>
  )
}

function ItemIconWithTooltip({
  item,
  index,
  className,
}: {
  item: TopItem
  index: number
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <img
          key={item.id}
          src={item.iconUrl}
          alt={item.displayName}
          className={cn(
            'relative size-5 min-w-5 rounded-full bg-white shadow',
            className,
          )}
          style={{ zIndex: 5 - index }}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold text-label-value-15">{item.displayName}</p>
        {item.issuer && (
          <p className="text-label-value-13 text-secondary">
            Issued by <span className="capitalize">{item.issuer}</span>
          </p>
        )}
        <p className="text-label-value-13 text-secondary">
          {item.volume ? formatCurrency(item.volume, 'usd') : EM_DASH}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

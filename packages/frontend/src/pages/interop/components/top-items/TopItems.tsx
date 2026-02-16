import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { TopItem } from './columns'

type InteropTopItemsCellProps = {
  topItems: TopItems<TopItem>
  setIsOpen: (isOpen: boolean) => void
}

export function InteropTopItems({
  topItems,
  setIsOpen,
  ...rest
}: InteropTopItemsCellProps & React.ComponentProps<'button'>) {
  return (
    <button
      className="group/dialog-trigger grid grid-cols-[46px_30px] items-center gap-1"
      onClick={() => setIsOpen(true)}
      {...rest}
    >
      <div className="-space-x-1.5 flex items-center">
        {topItems.items.map((item, i) => (
          <ItemIconWithTooltip key={item.id} item={item} index={i} />
        ))}
      </div>
      {topItems.remainingCount > 0 && (
        <span className="font-bold text-label-value-13 group-hover/dialog-trigger:underline">
          +{topItems.remainingCount}
        </span>
      )}
    </button>
  )
}

function ItemIconWithTooltip({
  item,
  index,
}: {
  item: TopItem
  index: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <img
          key={item.id}
          src={item.iconUrl}
          alt={item.displayName}
          className="relative size-5 min-w-5 rounded-full bg-white shadow"
          style={{ zIndex: 5 - index }}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold text-label-value-15">{item.displayName}</p>
        <p className="text-label-value-13 text-secondary">
          {item.volume ? formatCurrency(item.volume, 'usd') : EM_DASH}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

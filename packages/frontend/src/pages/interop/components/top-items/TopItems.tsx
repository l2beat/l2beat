import { formatCurrency } from '@l2beat/shared-pure'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  MAX_VISIBLE_PROJECTS,
  overflowCountClasses,
} from '~/components/ProjectIconList'
import { EM_DASH } from '~/consts/characters'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import { cn } from '~/utils/cn'

export type TopItem = {
  id?: string
  displayName: string
  issuer?: string | null
  iconUrl: string
  volume: number | null
  href?: string
}

type InteropTopItemsCellProps =
  | {
      topItems: TopItems<TopItem>
      hideDialog: true
      setIsOpen?: never
    }
  | {
      topItems: TopItems<TopItem>
      hideDialog?: false
      setIsOpen: (isOpen: boolean) => void
    }

const buttonVariants = cva('group/dialog-trigger flex items-center', {
  variants: {
    type: {
      default: 'gap-2',
      cell: 'gap-1.5',
    },
  },
})

const remainingCountVariants = cva('font-bold', {
  variants: {
    type: {
      default: 'text-label-value-13',
      cell: 'text-label-value-15',
    },
  },
})

const iconVariants = cva('rounded-full bg-white', {
  variants: {
    type: {
      default: 'size-7 min-w-7 border border-divider shadow-sm',
      cell: 'hover:-translate-y-0.5 relative size-5 min-w-5 shadow transition-transform hover:z-10!',
    },
  },
})

export function InteropTopItems({
  topItems,
  setIsOpen,
  className,
  type = 'default',
  hideDialog,
  ...rest
}: InteropTopItemsCellProps &
  Omit<React.ComponentProps<'button'>, 'type'> &
  VariantProps<typeof buttonVariants>) {
  // Same rule as ProjectIconList: all icons when they fit, otherwise one
  // fewer and the rest as "+N".
  const shown =
    topItems.remainingCount > 0
      ? topItems.items.slice(0, MAX_VISIBLE_PROJECTS - 1)
      : topItems.items
  const hiddenCount =
    topItems.remainingCount + topItems.items.length - shown.length
  const content = (
    <>
      <div className="flex items-center">
        {shown.map((item, i) => (
          <ItemIconWithTooltip
            key={item.id}
            item={item}
            index={i}
            type={type}
            href={item.href}
            className={cn(i !== shown.length - 1 && '-mr-1.5')}
          />
        ))}
      </div>
      {hiddenCount > 0 && (
        <RemainingCount
          count={hiddenCount}
          type={type}
          hideDialog={hideDialog}
        />
      )}
    </>
  )

  if (hideDialog) {
    return <div className={buttonVariants({ type, className })}>{content}</div>
  }

  return (
    <button
      type="button"
      className={buttonVariants({ type, className })}
      onClick={() => setIsOpen(true)}
      {...rest}
    >
      {content}
    </button>
  )
}

function RemainingCount({
  count,
  type,
  hideDialog,
}: {
  count: number
  hideDialog: boolean | undefined
} & VariantProps<typeof remainingCountVariants>) {
  if (!hideDialog) {
    return (
      <span
        className={cn(
          overflowCountClasses,
          'group-hover/dialog-trigger:border-secondary',
        )}
      >
        +{count}
      </span>
    )
  }
  return (
    <span className={remainingCountVariants({ type })}>
      +{count}
      {type === 'default' ? ' more' : ''}
    </span>
  )
}

function ItemIconWithTooltip({
  item,
  index,
  type,
  href,
  className,
}: {
  item: TopItem
  index: number
  href?: string
  className?: string
} & VariantProps<typeof iconVariants>) {
  const icon = (
    <img
      key={item.id}
      src={item.iconUrl}
      alt={item.displayName}
      className={iconVariants({ type, className })}
      style={{ zIndex: 5 - index }}
    />
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? <a href={href}>{icon}</a> : icon}
      </TooltipTrigger>
      <TooltipPortal>
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
      </TooltipPortal>
    </Tooltip>
  )
}

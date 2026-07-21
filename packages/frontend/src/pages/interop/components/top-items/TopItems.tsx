import { cva, type VariantProps } from 'class-variance-authority'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

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
      cell: 'gap-1',
    },
  },
})

const remainingCountVariants = cva('font-bold', {
  variants: {
    type: {
      default: 'text-label-value-13',
      cell: 'text-label-value-15',
    },
    hideDialog: {
      false: 'group-hover/dialog-trigger:underline',
    },
  },
  defaultVariants: {
    hideDialog: false,
  },
})

const iconVariants = cva('rounded-full bg-white', {
  variants: {
    type: {
      default: 'size-7 min-w-7 border border-divider shadow-sm',
      cell: 'relative size-5 min-w-5 shadow',
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
  const content = (
    <>
      <div className="flex items-center">
        {topItems.items.map((item, i) => (
          <ItemIconWithTooltip
            key={item.id}
            item={item}
            index={i}
            type={type}
            href={item.href}
            className={cn(i !== topItems.items.length - 1 && '-mr-1.5')}
          />
        ))}
      </div>
      {topItems.remainingCount > 0 && (
        <RemainingCount
          topItems={topItems}
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
  topItems,
  type,
  hideDialog,
}: {
  topItems: TopItems<TopItem>
} & VariantProps<typeof remainingCountVariants>) {
  return (
    <span className={remainingCountVariants({ type, hideDialog })}>
      +{topItems.remainingCount}
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

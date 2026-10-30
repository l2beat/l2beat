import {
  IconStackPill,
  iconStackPillClasses,
} from '~/components/ProjectIconList'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import { cn } from '~/utils/cn'

type TopItem = {
  displayName: string
  iconUrl: string
}

type InteropTopItemsProps =
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

/** The top items as a pill with the total count, opening the full list. */
export function InteropTopItems({
  topItems,
  setIsOpen,
  className,
  hideDialog,
  ...rest
}: InteropTopItemsProps & Omit<React.ComponentProps<'button'>, 'type'>) {
  const pill = (
    <IconStackPill
      icons={topItems.items.map((item) => ({
        name: item.displayName,
        iconUrl: item.iconUrl,
      }))}
      count={topItems.items.length + topItems.remainingCount}
      chevron={!hideDialog}
    />
  )

  if (hideDialog) {
    return (
      <span
        className={cn(
          iconStackPillClasses,
          'hover:bg-surface-secondary',
          className,
        )}
      >
        {pill}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={cn(iconStackPillClasses, className)}
      onClick={() => setIsOpen(true)}
      {...rest}
    >
      {pill}
    </button>
  )
}

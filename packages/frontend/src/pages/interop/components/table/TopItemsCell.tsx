import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export type TopItem = {
  id: string
  displayName: string
  iconUrl: string
  volume: number
}

type TopItemsCellProps = {
  items: TopItem[]
  itemType: 'tokens' | 'chains'
}

export function TopItemsCell({ items, itemType }: TopItemsCellProps) {
  const topItems = items.slice(0, 3)
  const restItems = items.slice(3)

  return (
    <div className="grid grid-cols-[46px_30px] gap-1">
      <div className="-space-x-1.5 flex items-center">
        {topItems.map((item, i) => (
          <ItemIconWithTooltip key={item.id} item={item} index={i} />
        ))}
      </div>
      {restItems.length > 0 && (
        <RestItemsDialog
          restItems={restItems}
          allItems={items}
          itemType={itemType}
        />
      )}
    </div>
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
      <TooltipTrigger>
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
          {formatCurrency(item.volume, 'usd')}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function RestItemsDialog({
  restItems,
  allItems,
  itemType,
}: {
  restItems: TopItem[]
  allItems: TopItem[]
  itemType: 'tokens' | 'chains'
}) {
  const [open, setOpen] = useState(false)
  const title = `Top ${itemType} by volume`
  const description = `Search for ${itemType}`
  const placeholder = `Start typing to find ${itemType.slice(0, -1)}...`
  const emptyMessage = `No ${itemType} found.`

  return (
    <>
      <button
        className="font-bold text-label-value-13 hover:underline"
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        +{restItems.length}
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
      >
        <Command className="rounded-none">
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {allItems.map((item) => (
                <CommandItem
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.iconUrl}
                      alt={item.displayName}
                      className="size-5"
                    />
                    <span className="font-bold text-label-value-15">
                      {item.displayName}
                    </span>
                  </div>
                  <span className="font-medium text-label-value-14 text-secondary">
                    {formatCurrency(item.volume, 'usd')}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

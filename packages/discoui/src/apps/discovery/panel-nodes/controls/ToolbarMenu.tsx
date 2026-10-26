import { type ReactNode, useState } from 'react'
import { Kbd } from '../../../../components/Kbd'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { cn } from '../../../../utils/cn'
import { IconControlChevronDown } from './icons/IconControlChevronDown'
import { ToolbarButton } from './ToolbarButton'

export interface ToolbarMenuItem {
  label: string
  icon?: ReactNode
  count?: number
  shortcut?: readonly string[]
  disabled?: boolean
  onSelect: () => void
}

export function ToolbarMenu(props: {
  label: string
  description: string
  disabled?: boolean
  sections: readonly (readonly ToolbarMenuItem[])[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          label={props.label}
          description={props.description}
          disabled={props.disabled}
          className="pr-1.5 pl-2.5"
        >
          {props.label}
          <IconControlChevronDown
            className={cn(
              'shrink-0 text-coffee-400 transition-transform',
              open && 'rotate-180',
            )}
          />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="min-w-48 border-coffee-600 p-1"
      >
        {props.sections.map((items, i) => (
          <div
            key={items[0]?.label ?? i}
            className="not-first:mt-1 flex flex-col not-first:border-coffee-700 not-first:border-t not-first:pt-1"
          >
            {items.map((item) => (
              <MenuItem
                key={item.label}
                item={item}
                onSelect={() => {
                  item.onSelect()
                  setOpen(false)
                }}
              />
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function MenuItem(props: { item: ToolbarMenuItem; onSelect: () => void }) {
  const { item } = props
  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={props.onSelect}
      className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-coffee-200 text-xs transition-colors hover:bg-coffee-700 disabled:pointer-events-none disabled:opacity-40"
    >
      <span className="flex w-4 shrink-0 justify-center text-coffee-400">
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.count !== undefined && (
        <span className="rounded-full bg-coffee-800 px-1.5 py-0.5 text-[11px] text-coffee-400 tabular-nums leading-none">
          {item.count}
        </span>
      )}
      {item.shortcut && (
        <Kbd tone="dark" size="sm" keys={[[...item.shortcut]]} />
      )}
    </button>
  )
}

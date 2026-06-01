import { type ReactNode, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { IconChevronDown } from '../../../../icons/IconChevronDown'
import { cn } from '../../../../utils/cn'
import { ControlButton } from './ControlButton'

export interface DropdownOption {
  label: string
  onSelect?: () => void
  disabled?: boolean
  count?: number
  icon?: ReactNode
  /**
   * Custom row content. When provided, the row renders this node instead of a
   * clickable label button and does NOT auto-close the popover, so the row can
   * own its own interactive controls (e.g. separate Expand/Collapse buttons).
   */
  content?: ReactNode
}

export function ControlDropdownButton(props: {
  label: string
  icon: ReactNode
  disabled?: boolean
  className?: string
  options: DropdownOption[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ControlButton
          disabled={props.disabled}
          className={cn('h-full px-3 py-2.5', props.className)}
        >
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <span className="shrink-0 text-coffee-300">{props.icon}</span>
              <span className="font-medium text-sm leading-none">
                {props.label}
              </span>
            </span>
            <IconChevronDown
              className={cn(
                'shrink-0 text-coffee-300 transition-transform',
                open && 'rotate-180',
              )}
            />
          </span>
        </ControlButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="min-w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
      >
        {props.options.map((option, i) => {
          const isLast = i === props.options.length - 1
          if (option.content !== undefined) {
            return (
              <div
                key={option.label}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-3 py-2 text-coffee-100 text-xs',
                  !isLast && 'border-coffee-600/70 border-b',
                )}
              >
                {option.content}
              </div>
            )
          }
          return (
            <button
              key={option.label}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                option.onSelect?.()
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-coffee-100 text-xs transition-colors',
                !isLast && 'border-coffee-600/70 border-b',
                !option.disabled && 'hover:bg-coffee-800',
                option.disabled && 'cursor-default text-coffee-400',
              )}
            >
              <span className="flex items-center gap-2">
                {option.icon && (
                  <span className="shrink-0 text-coffee-300">{option.icon}</span>
                )}
                <span>{option.label}</span>
              </span>
              {option.count !== undefined && (
                <span className="rounded-full bg-coffee-800 px-1.5 py-0.5 text-[11px] text-coffee-300/90 tabular-nums leading-none">
                  {option.count}
                </span>
              )}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

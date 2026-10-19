import {
  type ButtonHTMLAttributes,
  type FocusEvent,
  forwardRef,
  useState,
} from 'react'
import { Kbd } from '../../../../components/Kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../../../../components/Tooltip'
import { cn } from '../../../../utils/cn'

const TOOLTIP_DELAY_MS = 300

type ToolbarButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'title'
> & {
  label: string
  description?: string
  shortcut?: readonly string[]
  active?: boolean
  'data-state'?: string
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      label,
      description,
      shortcut,
      active,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    // Popover and dialog triggers mark the button open, and their content
    // would sit under the tooltip.
    const ownsOpenPopup = props['data-state'] === 'open'

    return (
      <Tooltip
        delayDuration={TOOLTIP_DELAY_MS}
        open={tooltipOpen && !ownsOpenPopup}
        onOpenChange={setTooltipOpen}
      >
        {/* A disabled button gets no pointer events, so the wrapper hosts the
            tooltip. Only keyboard focus opens it, so a popup handing focus
            back after a click does not. */}
        <TooltipTrigger asChild onFocus={skipUnlessFocusVisible}>
          <span className="inline-flex">
            <button
              {...props}
              ref={ref}
              type={type}
              aria-label={label}
              aria-pressed={active}
              className={cn(
                'inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-coffee-200 text-xs transition-colors duration-100',
                'hover:bg-coffee-700 data-[state=open]:bg-coffee-700',
                'disabled:pointer-events-none disabled:opacity-40',
                active && 'bg-coffee-600 text-autumn-300 hover:bg-coffee-600',
                className,
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="top" sideOffset={8}>
            <span className="flex items-center gap-2 text-coffee-200">
              {label}
              {shortcut && <Kbd tone="dark" size="sm" keys={[[...shortcut]]} />}
            </span>
            {description && (
              <span className="mt-0.5 block text-coffee-400">
                {description}
              </span>
            )}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    )
  },
)

ToolbarButton.displayName = 'ToolbarButton'

function skipUnlessFocusVisible(event: FocusEvent<HTMLSpanElement>) {
  const target = event.target
  if (target instanceof Element && target.matches(':focus-visible')) {
    return
  }
  event.preventDefault()
}

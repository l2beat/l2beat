import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../../../utils/cn'

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // Pressed state for toggle-like buttons: lighter than hover so the two
  // read differently, and it keeps that fill while hovered.
  active?: boolean
}

export const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ className, disabled, active, type = 'button', ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={active}
        className={cn(
          'inline-flex shrink-0 items-center justify-center self-stretch whitespace-nowrap rounded-lg border border-coffee-600 bg-coffee-800 px-3 py-2 text-coffee-100 text-xs transition-colors duration-100',
          !disabled && !active && 'hover:bg-coffee-700',
          active && 'border-autumn-300 bg-coffee-600 hover:bg-coffee-600',
          disabled && 'pointer-events-none cursor-default text-coffee-400',
          className,
        )}
      />
    )
  },
)

ControlButton.displayName = 'ControlButton'

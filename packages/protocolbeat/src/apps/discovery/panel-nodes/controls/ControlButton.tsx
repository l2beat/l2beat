import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ className, disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          'inline-flex shrink-0 items-center justify-center self-stretch whitespace-nowrap rounded-lg border border-coffee-600 bg-coffee-800 px-3 py-2 text-coffee-100 text-xs transition-colors duration-100',
          !disabled && 'hover:bg-coffee-700',
          disabled && 'cursor-default text-coffee-400',
          className,
        )}
      />
    )
  },
)

ControlButton.displayName = 'ControlButton'

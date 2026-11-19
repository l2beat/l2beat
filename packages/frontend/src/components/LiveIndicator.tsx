import type { CSSProperties } from 'react'
import { cn } from '~/utils/cn'

/**
 * Keeps pinging, so what it marks reads as live. Disabled, it is grey and
 * still, and one given a colour takes it back while a group around it is
 * hovered
 */
export function LiveIndicator({
  size = 'sm',
  disabled,
  color,
  className,
}: {
  size?: 'sm' | 'md'
  disabled?: boolean
  /** A CSS colour, instead of red */
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'relative flex',
        size === 'sm' && 'ml-0.5 size-2',
        size === 'md' && 'ml-[3px] size-3',
        className,
      )}
      style={
        color ? ({ '--live-indicator': color } as CSSProperties) : undefined
      }
    >
      <span
        className={cn(
          'absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none',
          color ? 'bg-(--live-indicator)' : 'bg-red-400',
          disabled && 'hidden',
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full',
          color ? 'bg-(--live-indicator)' : 'bg-negative',
          disabled && 'bg-secondary',
          disabled && color && 'group-hover:bg-(--live-indicator)',
          size === 'sm' && 'size-2',
          size === 'md' && 'size-3',
        )}
      />
    </span>
  )
}

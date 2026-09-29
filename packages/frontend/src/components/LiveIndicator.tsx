import { cn } from '~/utils/cn'

export function LiveIndicator({
  size = 'sm',
  disabled,
  label,
}: {
  size?: 'sm' | 'md'
  disabled?: boolean
  label?: string
}) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn(
        'relative flex',
        size === 'sm' && 'ml-0.5 size-2',
        size === 'md' && 'ml-[3px] size-3',
      )}
    >
      <span
        className={cn(
          'absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75',
          disabled && 'hidden',
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full bg-negative',
          disabled && 'bg-secondary',
          size === 'sm' && 'size-2',
          size === 'md' && 'size-3',
        )}
      />
    </span>
  )
}

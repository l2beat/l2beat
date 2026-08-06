import { cn } from '~/utils/cn'

export function LiveIndicator({
  size = 'sm',
  disabled,
}: {
  size?: 'sm' | 'md' | 'xl'
  disabled?: boolean
}) {
  return (
    <span
      className={cn(
        'relative flex',
        size === 'sm' && 'ml-0.5 size-2',
        size === 'md' && 'ml-[3px] size-3',
        size === 'xl' && 'ml-1 size-6',
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
          size === 'xl' && 'size-6',
        )}
      />
    </span>
  )
}

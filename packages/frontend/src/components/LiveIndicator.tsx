import { cn } from '~/utils/cn'

export function LiveIndicator({
  size = 'sm',
  disabled,
}: {
  size?: 'sm' | 'md'
  disabled?: boolean
}) {
  return (
    <span
      className={cn(
        'relative flex',
        size === 'sm' && 'ml-0.5 size-2',
        size === 'md' && 'ml-[3px] size-3',
      )}
    >
      {/* the dot alone says live where motion is turned down */}
      <span
        className={cn(
          'absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:hidden',
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

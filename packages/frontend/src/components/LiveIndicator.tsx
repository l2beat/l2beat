import { cn } from '~/utils/cn'

const sizes = {
  sm: 'size-2',
  md: 'size-3',
}
type Size = keyof typeof sizes

export function LiveIndicator({
  size = 'sm',
  disabled,
}: {
  size?: Size
  disabled?: boolean
}) {
  const sizeClassName = sizes[size]
  return (
    <span className={cn('relative flex', sizeClassName)}>
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
          sizeClassName,
        )}
      />
    </span>
  )
}

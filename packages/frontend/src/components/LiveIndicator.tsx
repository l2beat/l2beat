import { cn } from '~/utils/cn'

const sizes = {
  sm: 'size-2',
  md: 'size-3',
}
type Size = keyof typeof sizes

export function LiveIndicator({ size = 'sm' }: { size?: Size }) {
  const sizeClassName = sizes[size]
  return (
    <span className={cn('relative flex', sizeClassName)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
      <span
        className={cn(
          'relative inline-flex rounded-full bg-negative',
          sizeClassName,
        )}
      ></span>
    </span>
  )
}

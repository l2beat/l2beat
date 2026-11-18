import { cn } from '~/utils/cn'

/**
 * Keeps pinging, so what it marks reads as live. Off, it is grey and still,
 * lighting up when a group around it is hovered
 */
export function LiveDot({
  off,
  color,
  className,
}: {
  off?: boolean
  /** Instead of the brand's */
  color?: string
  className?: string
}) {
  const style = color ? { backgroundColor: color } : undefined
  return (
    <span className={cn('relative flex size-2 shrink-0', className)}>
      {!off && (
        <span
          className="absolute inline-flex size-full rounded-full bg-brand opacity-60 motion-safe:animate-ping"
          style={style}
        />
      )}
      <span
        className={cn(
          'relative inline-flex size-2 rounded-full',
          off ? 'bg-secondary group-hover:bg-brand' : 'bg-brand',
        )}
        style={off ? undefined : style}
      />
    </span>
  )
}

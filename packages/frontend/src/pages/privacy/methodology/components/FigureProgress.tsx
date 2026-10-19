import { cn } from '~/utils/cn'

/** One bar per autoplay step; the current one fills while it plays. */
export function FigureProgress({
  steps,
  step,
  playing,
  intervalMs,
  className,
}: {
  steps: number
  step: number
  playing: boolean
  intervalMs: number
  className?: string
}) {
  return (
    <div aria-hidden className={cn('flex gap-1', className)}>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          className="h-0.5 flex-1 overflow-hidden rounded-full bg-divider"
        >
          <span
            key={`${step}-${playing}`}
            className={cn(
              'block h-full origin-left bg-brand',
              i < step && 'scale-x-100',
              i > step && 'scale-x-0',
              i === step &&
                (playing ? 'animate-methodology-progress' : 'scale-x-100'),
            )}
            style={
              i === step && playing
                ? { animationDuration: `${intervalMs}ms` }
                : undefined
            }
          />
        </span>
      ))}
    </div>
  )
}

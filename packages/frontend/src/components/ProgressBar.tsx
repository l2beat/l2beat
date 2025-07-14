import { cn } from '~/utils/cn'

interface ProgressBarSVGProps {
  progress: number
  className?: string
  progressClassName?: string
  trackClassName?: string
}

export function ProgressBar({
  progress,
  className,
  progressClassName,
  trackClassName,
}: ProgressBarSVGProps) {
  return (
    <div className={cn('relative h-3 w-full', className)}>
      {/* Background track */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border border-divider bg-surface-primary',
          trackClassName,
        )}
      />

      {/* Progress fill */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full bg-primary',
          progressClassName,
        )}
        style={{
          width: `${Math.max(0, Math.min(progress, 100))}%`,
          transition: 'width 0.3s ease-in-out',
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

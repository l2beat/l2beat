import type { ReactNode } from 'react'
import { ChartPreviousDataDim } from '~/components/core/chart/ChartPreviousData'
import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'

export interface ChartInsightPart {
  label: string
  value: number
  /** The value as the legend shows it, e.g. `$45.6K`. */
  formattedValue: string
  color: string
  /**
   * The text colour on the part's colour in the bar, at least 4.5:1 in
   * both modes (default near-black).
   */
  textClassName?: string
}

/**
 * What a chart's period adds up to, read before the chart: one sentence and
 * a bar of the parts it compares, in the chart's own colours. The parts are
 * named in the bar where they are wide enough, and in the legend under it.
 */
export function ChartInsight({
  eyebrow,
  headline,
  parts,
  isLoading,
  isPlaceholderData,
  className,
}: {
  /** What is compared and over which period, e.g. `Paid to Ethereum · 1 year`. */
  eyebrow: string
  /** One sentence; wrap its figures in `<strong>`. */
  headline: ReactNode
  parts: ChartInsightPart[]
  isLoading: boolean
  isPlaceholderData: boolean
  className?: string
}) {
  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  const total = parts.reduce((sum, part) => sum + part.value, 0)
  if (total <= 0) return null
  // Parts too thin to draw are left to the legend.
  const shown = parts.filter((part) => part.value / total >= MIN_SHARE_DRAWN)

  return (
    <ChartPreviousDataDim isPlaceholderData={isPlaceholderData}>
      <div className={cn('flex flex-col gap-3', className)}>
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-label-value-12 text-secondary uppercase tracking-[0.04em]">
            {eyebrow}
          </p>
          {/* Two lines' room beside another insight on a wide page, so the bars
            and charts under both start level whichever sentence wraps. */}
          <p className="@min-[1200px]/details:min-h-[2lh] text-balance font-semibold text-heading-20 leading-tight tracking-[-0.01em] md:text-heading-24 [&_strong]:font-bold">
            {headline}
          </p>
        </div>
        <div className="flex h-8 overflow-hidden rounded-md">
          {shown.map((part, i) => {
            const share = part.value / total
            return (
              <div
                key={part.label}
                // Widths are the exact shares: the label sits on top and
                // takes no room, and the lines between parts are drawn
                // inside them. The last part fills the rounding left over.
                className={cn(
                  '@container relative shrink-0 overflow-hidden',
                  i > 0 && 'shadow-[inset_2px_0_0_var(--surface-primary)]',
                  i === shown.length - 1 && 'grow',
                )}
                style={{
                  width: `${share * 100}%`,
                  backgroundColor: part.color,
                }}
              >
                {/* One line: the share, and the name before it while both
                  fit. A name that doesn't fit wraps onto a second, clipped
                  line, so it drops whole instead of truncating. */}
                <span className="absolute inset-y-0 right-2 left-3 flex @max-[44px]:hidden items-center">
                  <span
                    className={cn(
                      'flex h-[1lh] flex-row-reverse flex-wrap justify-end gap-x-1 overflow-hidden font-semibold text-label-value-14 leading-tight',
                      part.textClassName ?? 'text-black',
                    )}
                  >
                    <span>{formatShare(share)}</span>
                    <span className="whitespace-nowrap">{part.label}</span>
                  </span>
                </span>
              </div>
            )
          })}
        </div>
        {/* Two lines' room beside another insight on a wide page, so the paired
          cards' charts start level whichever legend wraps. */}
        <ul className="flex @min-[1200px]/details:min-h-[calc(2lh+0.25rem)] flex-wrap content-start gap-x-4 gap-y-1 text-label-value-13">
          {parts
            .filter((part) => part.value > 0)
            .map((part) => (
              <li key={part.label} className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-xs"
                  style={{ backgroundColor: part.color }}
                />
                {part.label}
                <span className="font-semibold text-primary tabular-nums">
                  {part.formattedValue}
                </span>
                <span className="text-secondary tabular-nums">
                  · {formatShare(part.value / total)}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </ChartPreviousDataDim>
  )
}

/** Under half a percent is narrower than the line between parts. */
const MIN_SHARE_DRAWN = 0.005

export function formatShare(share: number) {
  if (share > 0 && share < 0.01) return '<1%'
  return `${Math.round(share * 100)}%`
}

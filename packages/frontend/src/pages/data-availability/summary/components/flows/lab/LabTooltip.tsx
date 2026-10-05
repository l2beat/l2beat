import { formatSeconds } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatBlobs } from '../daFlowsUnit'
import { formatPosted } from '../formatPosted'
import type { LabPoster } from './model'

const GAP = 14

/**
 * A tooltip that follows the pointer over a drawing, where there is no
 * element per mark to hang the site's own tooltip on. It sits beside the
 * pointer, on whichever side has room.
 */
export function LabTooltip({
  x,
  y,
  containerWidth,
  children,
}: {
  /** Pointer position inside the variant's box */
  x: number
  y: number
  containerWidth: number
  children: ReactNode
}) {
  const flip = x > containerWidth * 0.6
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 w-max max-w-[260px] rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary shadow-popover dark:bg-header-secondary',
      )}
      style={{
        left: flip ? undefined : x + GAP,
        right: flip ? containerWidth - x + GAP : undefined,
        top: y + GAP,
      }}
    >
      {children}
    </div>
  )
}

/** Who the poster is and how it posts, the same in every variant */
export function PosterTooltipContent({
  poster,
  footer,
}: {
  poster: LabPoster
  /** What the mark under the pointer adds, as the blobs of one batch */
  footer?: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 font-bold text-label-value-14">
        {poster.iconUrl && (
          <img src={poster.iconUrl} alt="" className="size-4 rounded-full" />
        )}
        {poster.name}
      </div>
      <div className="flex justify-between gap-4 text-label-value-13">
        <span className="text-secondary">Posted in the day</span>
        <span className="tabular-nums">
          {formatPosted(poster.posted)}{' '}
          <span className="text-secondary">{formatPercent(poster.share)}</span>
        </span>
      </div>
      <div className="flex justify-between gap-4 text-label-value-13">
        <span className="text-secondary">
          {poster.cadenceMeasured ? 'Posts' : 'Posts about'}
        </span>
        <span className="tabular-nums">
          {formatBlobs(poster.cadence.blobsPerBatch)} every{' '}
          {formatSeconds(poster.cadence.interval)}
        </span>
      </div>
      {footer && (
        <div className="border-divider border-t pt-1.5 text-label-value-13 text-secondary">
          {footer}
        </div>
      )}
    </div>
  )
}

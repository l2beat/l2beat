import { cn } from '~/utils/cn'
import { formatShare } from '../utils/format'

interface SharePart {
  key: string
  value: number
  /** A CSS colour */
  color: string
  /** Written inside the part where it fits; the share by default */
  label?: string
  textClassName?: string
}

/** Below this share of the bar a part's label would not fit */
const MIN_LABELLED_SHARE = 0.09

/**
 * One 100% bar. Each part keeps its exact share, however thin; parts of zero
 * are not drawn, nor is a bar of zero
 */
export function ShareBar({
  parts,
  className,
  minLabelledShare = MIN_LABELLED_SHARE,
}: {
  parts: SharePart[]
  className?: string
  minLabelledShare?: number
}) {
  const total = parts.reduce((sum, p) => sum + Math.max(0, p.value), 0)
  if (total <= 0) return null
  return (
    <div
      className={cn(
        'flex h-7 w-full gap-px overflow-hidden rounded',
        className,
      )}
    >
      {parts.map((part) => {
        const share = part.value / total
        if (!(share > 0)) return null
        return (
          <div
            key={part.key}
            className={cn(
              'flex min-w-0 items-center justify-center overflow-hidden font-semibold text-2xs text-white tabular-nums',
              part.textClassName,
            )}
            style={{ width: `${share * 100}%`, backgroundColor: part.color }}
          >
            {share >= minLabelledShare && (
              <span className="truncate px-1">
                {part.label ?? formatShare(share)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function KeySwatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-2 shrink-0 rounded-[2px]', className)}
      style={{ backgroundColor: color }}
    />
  )
}

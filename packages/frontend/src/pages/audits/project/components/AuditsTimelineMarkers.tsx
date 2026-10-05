import { pluralize } from '@l2beat/shared-pure'
import { useMemo, useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type {
  AuditsOwnReport,
  AuditsProjectTimeline,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  data: { timestamp: number }[] | undefined
  timeline: AuditsProjectTimeline
}

interface Bucket {
  timestamp: number
  audits: AuditsOwnReport[]
  changes: number[]
}

/**
 * Two rows of markers under the chart, on the same grid as its data: the
 * project's own audit reports, and the critical changes of its ossification
 * perimeter. Like ChartMilestones, every marker snaps to the last data point
 * at or before it.
 */
export function AuditsTimelineMarkers({ data, timeline }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const buckets = useMemo(() => getBuckets(data, timeline), [data, timeline])

  // The wrapper is always mounted: the observer attaches once, before the
  // data arrives.
  return (
    <div ref={ref} className="flex flex-col gap-1 empty:hidden">
      {buckets.length >= 2 && (
        <Lane
          label="Audits"
          buckets={buckets}
          width={width}
          isEmpty={(bucket) => bucket.audits.length === 0}
          renderMarker={(bucket) => <AuditMarker audits={bucket.audits} />}
          renderTooltip={(bucket) => <AuditTooltip audits={bucket.audits} />}
        />
      )}
      {buckets.length >= 2 && timeline.hasOssification && (
        <Lane
          label="Critical upgrades"
          buckets={buckets}
          width={width}
          isEmpty={(bucket) => bucket.changes.length === 0}
          renderMarker={(bucket) => <ChangeMarker changes={bucket.changes} />}
          renderTooltip={(bucket) => (
            <ChangeTooltip
              changes={bucket.changes}
              href={timeline.ossificationHref}
            />
          )}
        />
      )}
    </div>
  )
}

function Lane({
  label,
  buckets,
  width,
  isEmpty,
  renderMarker,
  renderTooltip,
}: {
  label: string
  buckets: Bucket[]
  width: number | undefined
  isEmpty: (bucket: Bucket) => boolean
  renderMarker: (bucket: Bucket) => React.ReactNode
  renderTooltip: (bucket: Bucket) => React.ReactNode
}) {
  return (
    <div className="relative h-5" aria-label={label}>
      {buckets.map((bucket, index) => {
        if (width === undefined || isEmpty(bucket)) return null
        const left = (index / (buckets.length - 1)) * width
        return (
          <Tooltip key={bucket.timestamp} delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className="-translate-x-1/2 absolute top-0 flex h-5 w-5 cursor-pointer items-center justify-center"
                style={{ left }}
              >
                {renderMarker(bucket)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-72">
              {renderTooltip(bucket)}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

export function AuditMarker({
  audits,
  className,
}: {
  audits: Pick<AuditsOwnReport, 'matched'>[]
  className?: string
}) {
  const matched = audits.some((audit) => audit.matched)
  return (
    <div
      className={cn(
        'flex size-4 items-center justify-center rounded-full border-2 border-brand font-bold text-[10px] leading-none',
        matched
          ? 'bg-brand text-primary-invert'
          : 'bg-surface-primary text-brand',
        className,
      )}
    >
      {audits.length > 1 && (audits.length > 9 ? '9+' : audits.length)}
    </div>
  )
}

export function ChangeMarker({
  changes,
  className,
}: {
  changes: number[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex size-3.5 rotate-45 items-center justify-center bg-primary font-bold text-[9px] text-primary-invert leading-none',
        className,
      )}
    >
      <span className="-rotate-45">
        {changes.length > 1 && (changes.length > 9 ? '9+' : changes.length)}
      </span>
    </div>
  )
}

function AuditTooltip({ audits }: { audits: AuditsOwnReport[] }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      {audits.map((audit) => (
        <div key={audit.id} className="flex flex-col">
          <span className="text-secondary text-xs">
            {formatTimestamp(audit.timestamp)} · {audit.auditor}
          </span>
          {audit.url ? (
            <CustomLink href={audit.url} className="font-bold">
              {audit.title}
            </CustomLink>
          ) : (
            <span className="font-bold">{audit.title}</span>
          )}
          {!audit.matched && (
            <span className="text-secondary text-xs">
              Did not match any deployed code.
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function ChangeTooltip({
  changes,
  href,
}: {
  changes: number[]
  href: string | undefined
}) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <span className="font-bold">
        {changes.length} critical {pluralize(changes.length, 'upgrade')}
      </span>
      {changes.map((change) => (
        <span key={change} className="text-secondary text-xs">
          {formatTimestamp(change, { mode: 'datetime' })}
        </span>
      ))}
      {href && (
        <CustomLink href={href} className="text-xs">
          See the project's ossification
        </CustomLink>
      )}
    </div>
  )
}

/** One bucket per data point; markers before the first point are dropped. */
export function getBuckets(
  data: { timestamp: number }[] | undefined,
  timeline: Pick<AuditsProjectTimeline, 'audits' | 'criticalChanges'>,
): Bucket[] {
  if (!data || data.length < 2) return []
  const buckets: Bucket[] = data.map((point) => ({
    timestamp: point.timestamp,
    audits: [],
    changes: [],
  }))
  const bucketOf = (timestamp: number) => {
    let found: Bucket | undefined
    for (const bucket of buckets) {
      if (bucket.timestamp > timestamp) break
      found = bucket
    }
    return found
  }
  for (const audit of timeline.audits) {
    bucketOf(audit.timestamp)?.audits.push(audit)
  }
  for (const change of timeline.criticalChanges) {
    bucketOf(change)?.changes.push(change)
  }
  return buckets
}

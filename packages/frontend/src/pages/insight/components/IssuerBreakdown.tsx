import { formatCurrency } from '@l2beat/shared-pure'
import type { InsightHolding } from '~/server/features/insight/InsightReport'
import { cn } from '~/utils/cn'
import {
  groupValueByIssuer,
  type IssuerSegment,
} from '../utils/groupValueByIssuer'

const NAMED_ISSUER_COUNT_MAX = 5
// Hatched, not filled: "no issuer recorded" is a gap in our data.
const NONE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(135deg, var(--color-secondary) 0 2px, transparent 2px 5px)',
}

/**
 * Who the visitor relies on for the value they hold, by issuer as token-db
 * records it. Each row labels its own bar, so one neutral color does.
 */
export function IssuerBreakdown({
  holdings,
  totalValueUsd,
}: {
  holdings: InsightHolding[]
  totalValueUsd: number
}) {
  const segments = groupValueByIssuer(holdings, NAMED_ISSUER_COUNT_MAX)
  if (segments.length === 0 || totalValueUsd <= 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="insight-issuers">
      <h2 id="insight-issuers" className="text-heading-16">
        Who issues what you hold
      </h2>
      <ul className="flex flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={getSegmentKey(segment)} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-label-value-14">
              <SegmentName segment={segment} />
              <span className="shrink-0 text-secondary tabular-nums">
                {formatCurrency(segment.valueUsd, 'usd')}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-secondary">
              <div
                className={cn(
                  'h-full min-w-1 rounded-full',
                  segment.kind !== 'none' && 'bg-primary/70',
                )}
                style={{
                  width: `${(segment.valueUsd / totalValueUsd) * 100}%`,
                  ...(segment.kind === 'none' ? NONE_STYLE : {}),
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SegmentName({ segment }: { segment: IssuerSegment }) {
  if (segment.kind === 'issuer') {
    return <span className="truncate capitalize">{segment.issuer}</span>
  }
  if (segment.kind === 'others') {
    return <span>{segment.issuerCount} other issuers</span>
  }
  return <span>No issuer recorded</span>
}

function getSegmentKey(segment: IssuerSegment): string {
  return segment.kind === 'issuer' ? `issuer:${segment.issuer}` : segment.kind
}

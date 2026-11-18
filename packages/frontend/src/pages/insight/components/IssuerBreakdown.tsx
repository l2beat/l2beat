import { formatCurrency } from '@l2beat/shared-pure'
import type { InsightHolding } from '~/server/features/insight/InsightReport'
import { cn } from '~/utils/cn'
import {
  groupValueByIssuer,
  type IssuerSegment,
} from '../utils/groupValueByIssuer'

const NAMED_ISSUER_COUNT_MAX = 4
// Ethereum keeps the site's Ethereum blue; other issuers take the rest in
// rank order, so the same issuer can change color between addresses.
const ETHEREUM_COLOR = 'bg-chart-ethereum'
// Sky is last: next to Ethereum blue it reads as the same issuer.
const ISSUER_COLORS = [
  'bg-chart-teal',
  'bg-chart-orange',
  'bg-chart-fuchsia',
  'bg-chart-sky',
]
const OTHERS_COLOR = 'bg-icon-secondary'
// Hatched, not a hue: "no issuer recorded" is a gap in our data.
const NONE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(135deg, var(--color-secondary) 0 2px, transparent 2px 6px)',
}

/**
 * Who the visitor relies on for the value they hold, by issuer as token-db
 * records it. The bar is decoration for the legend, which carries the data.
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
  const colors = assignColors(segments)

  return (
    <section className="flex flex-col gap-3" aria-labelledby="insight-issuers">
      <h2 id="insight-issuers" className="text-heading-16">
        Who issues what you hold
      </h2>
      <div
        className="flex h-3 gap-0.5 overflow-hidden rounded-full"
        aria-hidden
      >
        {segments.map((segment, i) => (
          <div
            key={getSegmentKey(segment)}
            className={cn('min-w-1', colors[i])}
            style={{
              width: `${(segment.valueUsd / totalValueUsd) * 100}%`,
              ...(segment.kind === 'none' ? NONE_STYLE : {}),
            }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((segment, i) => (
          <li key={getSegmentKey(segment)} className="flex items-center gap-2">
            <span
              className={cn('size-2.5 shrink-0 rounded-sm', colors[i])}
              style={segment.kind === 'none' ? NONE_STYLE : undefined}
            />
            <span className="text-label-value-14">
              <SegmentName segment={segment} />
            </span>
            <span className="text-label-value-14 text-secondary tabular-nums">
              {formatCurrency(segment.valueUsd, 'usd')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SegmentName({ segment }: { segment: IssuerSegment }) {
  if (segment.kind === 'issuer') {
    return <span className="capitalize">{segment.issuer}</span>
  }
  if (segment.kind === 'others') {
    return <>{segment.issuerCount} other issuers</>
  }
  return <>No issuer recorded</>
}

function assignColors(segments: IssuerSegment[]): (string | undefined)[] {
  let next = 0
  return segments.map((segment) => {
    if (segment.kind === 'others') return OTHERS_COLOR
    if (segment.kind === 'none') return undefined
    if (segment.issuer === 'ethereum') return ETHEREUM_COLOR
    const color = ISSUER_COLORS[next % ISSUER_COLORS.length]
    next++
    return color
  })
}

function getSegmentKey(segment: IssuerSegment): string {
  return segment.kind === 'issuer' ? `issuer:${segment.issuer}` : segment.kind
}

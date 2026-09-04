import { formatCurrency } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'

/** The ossification values that appear both in the comparison table and in a
 *  project's details, rendered identically in both places. */

export function ExposureValue({ exposure }: { exposure: number | null }) {
  if (exposure === null) return <NotApplicableBadge />
  return (
    <span className="tabular-nums">
      {formatCurrency(exposure, 'usd')}
      <span className="ml-0.5 text-secondary text-xs">·years</span>
    </span>
  )
}

/** One decimal below ten changes a year, integers above; an empty window is a
 *  plain zero rather than "0.0". */
export function ChangeRateValue({
  rate,
  eventCount,
}: {
  rate: number
  eventCount: number
}) {
  const text =
    eventCount === 0 ? '0' : rate >= 10 ? rate.toFixed(0) : rate.toFixed(1)
  return <span className="tabular-nums">{text}</span>
}

export function UnverifiedBadge({ className }: { className?: string }) {
  return (
    <Badge type="error" size="extraSmall" padding="small" className={className}>
      UNVERIFIED
    </Badge>
  )
}

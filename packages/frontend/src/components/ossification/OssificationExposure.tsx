import { formatCurrency } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import type { OssificationValueSource } from '~/server/features/projects/ossification/getOssificationSeries'

export const OSSIFICATION_VALUE_LABELS = {
  tvs: 'Canonical TVS',
  defillama: 'TVL (source: DefiLlama)',
} satisfies Record<OssificationValueSource, string>

export function OssificationExposure({
  exposure,
  valueSource,
}: {
  exposure: number | null
  valueSource: OssificationValueSource | null
}) {
  if (exposure === null) {
    return <NotApplicableBadge />
  }
  return (
    <span>
      {formatCurrency(exposure, 'usd')}
      <span className="font-normal text-secondary text-xs">·years</span>
      {valueSource === 'defillama' && (
        <span className="block font-normal text-2xs text-secondary">
          {OSSIFICATION_VALUE_LABELS.defillama}
        </span>
      )}
    </span>
  )
}

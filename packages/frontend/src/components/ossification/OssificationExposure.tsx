import { formatCurrency } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import type { OssificationValueSource } from '~/server/features/projects/ossification/getOssificationSeries'
import { OSSIFICATION_VALUE_LABELS } from './ossificationValueLabels'

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
          {OSSIFICATION_VALUE_LABELS.defillama.long}
        </span>
      )}
    </span>
  )
}

import type { PrivacyPromise } from '@l2beat/config'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { sentimentToRiskDot } from '../sentimentToRiskDot'

export function PrivacyAdversaryTooltipContent({
  cell,
  promise,
  hint,
}: {
  cell: PrivacyAdversarySummaryCell
  promise: PrivacyPromise
  /** e.g. "Click for details". */
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <div className="font-bold text-label-value-14">{cell.label}</div>
      <div className="flex items-center gap-2">
        <TrustedSetupRiskDot
          risk={sentimentToRiskDot(cell.sentiment)}
          size="sm"
          className="shrink-0"
        />
        <span className="font-medium text-base">{cell.value}</span>
        <span className="text-secondary text-xs">{cell.condition}</span>
      </div>
      <p className="text-secondary text-xs">
        <span className="font-medium">Promise:</span> {promise.text}
      </p>
      {hint && <p className="text-secondary text-xs">{hint}</p>}
    </div>
  )
}

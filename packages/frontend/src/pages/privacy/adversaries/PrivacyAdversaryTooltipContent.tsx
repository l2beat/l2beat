import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { sentimentToRiskDot } from '../sentimentToRiskDot'
import {
  EXPOSURE_TEXT_CLASS,
  PRIVACY_EXPOSURE_LABEL,
} from './privacyAdversaryUi'

export function PrivacyAdversaryTooltipContent({
  cell,
  hint,
}: {
  cell: PrivacyAdversarySummaryCell
  /** e.g. "Click for details". */
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <div className="font-bold text-label-value-14">{cell.label}</div>
      <p className="text-secondary text-xs">{cell.description}</p>
      <div className="flex items-center gap-2">
        <TrustedSetupRiskDot
          risk={sentimentToRiskDot(cell.sentiment)}
          size="sm"
          className="shrink-0"
        />
        <span className="whitespace-nowrap font-medium text-base">
          {cell.value}
        </span>
        <span className="text-secondary text-xs">{cell.condition}</span>
      </div>
      <p className="text-xs leading-normal">{cell.exposure}</p>
      {cell.alsoExposed.length > 0 && (
        <p className="text-xs">
          <span className="font-medium">Beyond the public observer: </span>
          {cell.alsoExposed.map((item, i) => (
            <span
              key={item.field}
              className={EXPOSURE_TEXT_CLASS[item.exposure]}
            >
              {i > 0 && <span className="text-secondary">, </span>}
              {item.label} {PRIVACY_EXPOSURE_LABEL[item.exposure]}
            </span>
          ))}
        </p>
      )}
      {hint && <p className="text-secondary text-xs">{hint}</p>}
    </div>
  )
}

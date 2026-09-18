import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { PrivacySentimentDot } from '../PrivacySentimentDot'
import {
  getPrivacyAdversaryTitle,
  PRIVACY_EXPOSURE_LABEL,
  PRIVACY_EXPOSURE_TEXT_CLASS_NAME,
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
      <div className="font-bold text-label-value-14">
        {getPrivacyAdversaryTitle(cell.label)}
      </div>
      <p className="text-secondary text-xs">{cell.description}</p>
      <div className="flex items-center gap-2">
        <PrivacySentimentDot sentiment={cell.sentiment} />
        <span className="whitespace-nowrap font-medium text-base">
          {cell.value}
        </span>
      </div>
      <p className="text-xs leading-normal">{cell.exposure}</p>
      {cell.alsoExposed.length > 0 && (
        <p className="text-xs">
          <span className="font-medium">Beyond the public observer: </span>
          {cell.alsoExposed.map((item, i) => (
            <span
              key={item.field}
              className={PRIVACY_EXPOSURE_TEXT_CLASS_NAME[item.exposure]}
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

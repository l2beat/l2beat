import type { PrivacyPromise } from '@l2beat/config'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import {
  EXPOSURE_TEXT_CLASS,
  PrivacySubjectGlyph,
  sentimentToExposure,
} from './PrivacySubjectGlyph'
import { PRIVACY_EXPOSURE_LABEL, worstExtraLeak } from './privacyAdversaryUi'

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
        <PrivacySubjectGlyph
          field={promise.protects}
          exposure={sentimentToExposure(cell.sentiment)}
          more={worstExtraLeak(cell)}
          size="sm"
        />
        <span className="whitespace-nowrap font-medium text-base">
          {cell.value}
        </span>
        <span className="text-secondary text-xs">{cell.condition}</span>
      </div>
      {cell.identity !== 'private' && (
        <p className="text-xs">
          <span className={EXPOSURE_TEXT_CLASS[cell.identity]}>
            Identity {PRIVACY_EXPOSURE_LABEL[cell.identity]}
          </span>
          <span className="text-secondary">
            {' '}
            (who you are: IP, account, KYC)
          </span>
        </p>
      )}
      {cell.alsoExposed.length > 0 && (
        <p className="text-xs">
          <span className="text-secondary">
            Also beyond a public observer:{' '}
          </span>
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
      <p className="text-secondary text-xs">
        <span className="font-medium">Promise:</span> {promise.text}
      </p>
      {hint && <p className="text-secondary text-xs">{hint}</p>}
    </div>
  )
}

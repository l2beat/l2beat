import type { PrivacyPromise } from '@l2beat/config'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import {
  EXPOSURE_TEXT_CLASS,
  PrivacyPlusBadge,
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
  /** Everything this adversary learns beyond a public observer. */
  const extra = cell.alsoExposed.map((f) => ({
    label: f.label,
    exposure: f.exposure,
  }))
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
      {extra.length > 0 && (
        <p className="text-xs">
          <PrivacyPlusBadge
            exposure={worstExtraLeak(cell) ?? 'private'}
            size="sm"
            className="mr-0.5 align-[-1px]"
          />
          <span
            className={cn(
              'font-bold',
              EXPOSURE_TEXT_CLASS[worstExtraLeak(cell) ?? 'private'],
            )}
          >
            :{' '}
          </span>
          {extra.map((item, i) => (
            <span
              key={item.label}
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

import type { RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'
import {
  sentimentToOpaqueBgColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import type { Verdict } from './verdict'

/** Our assessment in one sentence, right under the live numbers it qualifies */
export function RiskVerdict({
  verdict,
  className,
}: {
  verdict: Verdict
  className?: string
}) {
  return (
    <div className={className}>
      <div className="text-label-value-14 text-secondary">What you trust</div>
      <p className="mt-2 max-w-[48ch] font-light text-[20px] text-primary leading-[1.4] md:text-[26px]">
        {verdict.sentence}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {verdict.values.map((value) => (
          <RiskPill key={value.name} value={value} />
        ))}
        {verdict.isUnderReview && (
          <span className="rounded-full bg-surface-warning/20 px-3 py-1.5 font-medium text-label-value-14 text-primary">
            Under review
          </span>
        )}
        <a
          href="#risk-summary"
          className="rounded-full px-3 py-1.5 font-medium text-label-value-14 text-link underline decoration-link-stroke underline-offset-4 hover:decoration-link"
        >
          {verdict.riskCount > 0
            ? `Read the ${verdict.riskCount} risks`
            : 'Read the risk summary'}
        </a>
      </div>
    </div>
  )
}

export function RiskPill({
  value,
  className,
}: {
  value: RosetteValue
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-label-value-14',
        sentimentToTransparentBgColor(value.sentiment ?? 'neutral'),
        className,
      )}
    >
      <span
        className={cn(
          'size-2 rounded-full',
          sentimentToOpaqueBgColor(value.sentiment ?? 'neutral'),
        )}
      />
      <span className="text-secondary">{value.name}</span>
      <span className="font-bold text-primary">{value.value}</span>
    </span>
  )
}

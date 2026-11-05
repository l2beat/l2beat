import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { formatRange, formatTimestamp } from '~/utils/dates'
import { formatValueLine } from './formatValueLine'
import { OSSIFICATION_VALUE_LABELS } from './ossificationValueLabels'

type Props = Pick<OssificationStats, 'exposure' | 'valueSource' | 'timeline'>

export function OssificationExposure({
  exposure,
  valueSource,
  timeline,
}: Props) {
  if (exposure === null) {
    return <NotApplicableBadge />
  }
  const label = OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short
  // A start hours after the clock would repeat the date above.
  const dataStartsLater =
    UnixTime.toStartOf(exposure.since, 'day') >
    UnixTime.toStartOf(timeline.clockStart, 'day')
  return (
    // The calculation and the peak show nowhere else on the page.
    <Tooltip contentInHtml>
      <TooltipTrigger className="text-left">
        {formatCurrency(exposure.value, 'usd')}
        <span className="font-normal text-secondary text-xs">·years</span>
        {valueSource === 'defillama' && (
          <span className="block font-normal text-2xs text-secondary">
            {OSSIFICATION_VALUE_LABELS.defillama.long}
          </span>
        )}
      </TooltipTrigger>
      {/* Table cells set whitespace-pre, which would keep formatRange's line break. */}
      <TooltipContent className="flex max-w-80 flex-col gap-1.5 whitespace-normal">
        <div>
          <div className="font-bold">Battle-tested exposure</div>
          <div className="text-secondary">
            {formatRange(timeline.clockStart, timeline.to)}
          </div>
        </div>
        {exposure.years > 0 && (
          <span>
            {formatCurrency(exposure.value / exposure.years, 'usd')} average{' '}
            {label} × {formatYears(exposure.years)} years
            {dataStartsLater
              ? `, since ${label} data starts on ${formatTimestamp(exposure.since)}.`
              : ' unchanged.'}
          </span>
        )}
        <span>{formatValueLine({ timeline, valueSource })}</span>
      </TooltipContent>
    </Tooltip>
  )
}

// Three significant digits keep both the average and its product with the
// years within 0.5% of the exact values. Never exponential, unlike toPrecision.
const YEARS_FORMAT = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
})

function formatYears(years: number) {
  return YEARS_FORMAT.format(years)
}

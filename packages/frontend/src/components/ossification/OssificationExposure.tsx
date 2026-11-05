import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { formatRange } from '~/utils/dates'
import { formatValueLine } from './formatValueLine'
import { OSSIFICATION_VALUE_LABELS } from './ossificationValueLabels'

const SECONDS_PER_YEAR = 365 * UnixTime.DAY

type Props = Pick<OssificationStats, 'exposure' | 'valueSource' | 'timeline'>

export function OssificationExposure({
  exposure,
  valueSource,
  timeline,
}: Props) {
  if (exposure === null) {
    return <NotApplicableBadge />
  }
  const years = (timeline.to - timeline.clockStart) / SECONDS_PER_YEAR
  return (
    // The calculation and the peak show nowhere else on the page.
    <Tooltip contentInHtml>
      <TooltipTrigger className="text-left">
        {formatCurrency(exposure, 'usd')}
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
        {years > 0 && (
          <span>
            {formatCurrency(exposure / years, 'usd')} average{' '}
            {OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short} ×{' '}
            {formatYears(years)} years unchanged.
          </span>
        )}
        <span>{formatValueLine({ timeline, valueSource })}</span>
      </TooltipContent>
    </Tooltip>
  )
}

/** Two significant digits under a year, so a day reads 0.0027, not 0.00. */
function formatYears(years: number) {
  return years < 1 ? years.toPrecision(2) : years.toFixed(1)
}

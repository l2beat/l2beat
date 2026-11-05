import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { formatTimestamp } from '~/utils/dates'
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
    <Tooltip>
      <TooltipTrigger className="text-left">
        {formatCurrency(exposure, 'usd')}
        <span className="font-normal text-secondary text-xs">·years</span>
        {valueSource === 'defillama' && (
          <span className="block font-normal text-2xs text-secondary">
            {OSSIFICATION_VALUE_LABELS.defillama.long}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent className="flex max-w-80 flex-col gap-1.5">
        <div>
          <div className="font-bold">Battle-tested exposure</div>
          <div className="text-secondary">
            {formatTimestamp(timeline.clockStart)} –{' '}
            {formatTimestamp(timeline.to)}
          </div>
        </div>
        {years > 0 && (
          <span>
            {formatCurrency(exposure / years, 'usd')} average{' '}
            {OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short} ×{' '}
            {years.toFixed(years < 1 ? 2 : 1)} years unchanged.
          </span>
        )}
        <span>{formatValueLine({ timeline, valueSource })}</span>
      </TooltipContent>
    </Tooltip>
  )
}

import { formatActivityCount, formatInteger } from '@l2beat/shared-pure'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import {
  TooltipHeader,
  TooltipRow,
} from '~/components/core/tooltip/TooltipParts'
import { PercentChange } from '~/components/PercentChange'
import type { LiveMetric } from './liveSteps'
import { formatBucket, formatGas } from './liveView'

/**
 * Laid out as the history's: the bucket's rate, with the past week's at this
 * hour under it, then the total it comes from
 */
export function LiveTooltip({
  row,
  bucket,
  metric,
  color,
}: {
  row: {
    timestamp: number
    value: number | null
    blocks: number
    usualMin: number | null
    usualMedian: number | null
    usualMax: number | null
  }
  bucket: number
  metric: LiveMetric
  color: string
}) {
  const { value, blocks, usualMin, usualMedian, usualMax } = row
  const format = metric === 'gas' ? formatGas : formatRate
  return (
    <ChartTooltipWrapper>
      <div className="flex w-48 flex-col sm:w-64">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatBucket(row.timestamp, bucket)}
        </ChartTooltipTitle>
        {value === null ? (
          <span className="text-secondary">No blocks stored yet</span>
        ) : (
          <>
            <TooltipHeader label={RATE_LABEL[metric]} />
            <div className="mt-2 flex flex-col gap-2">
              <ChartTooltipRow name="value">
                <span className="flex items-baseline gap-1">
                  <ChartTooltipValue
                    value={value}
                    format={format}
                    className="tabular-nums"
                  />
                  {usualMedian !== null && usualMedian > 0 && (
                    <PercentChange
                      value={value / usualMedian - 1}
                      className="min-w-0"
                    />
                  )}
                </span>
              </ChartTooltipRow>
              {usualMin !== null &&
                usualMedian !== null &&
                usualMax !== null && (
                  <>
                    <TooltipRow
                      indicator={
                        <ChartDataIndicator
                          type={{ shape: 'line', strokeDasharray: '3 3' }}
                          backgroundColor="var(--secondary)"
                        />
                      }
                      label="Usual at this hour"
                      labelClassName="w-20 sm:w-fit"
                    >
                      <span className="flex items-baseline gap-1">
                        <ChartTooltipValue
                          value={usualMedian}
                          format={format}
                          className="tabular-nums"
                        />
                        <span className={SECONDARY_VALUE}>
                          ({format(usualMin)}–{format(usualMax)})
                        </span>
                      </span>
                    </TooltipRow>
                    <UsualBar
                      value={value}
                      min={usualMin}
                      median={usualMedian}
                      max={usualMax}
                      color={color}
                    />
                  </>
                )}
            </div>
            <TooltipHeader className="mt-3" label={TOTAL_LABEL[metric]} />
            <div className="mt-2 flex flex-col gap-2">
              <ChartTooltipRow name="value">
                <span className="flex items-baseline gap-1">
                  <ChartTooltipValue
                    value={value * bucket}
                    format={(total) =>
                      metric === 'gas'
                        ? formatGas(total)
                        : formatInteger(Math.round(total))
                    }
                    className="tabular-nums"
                  />
                  <span className={SECONDARY_VALUE}>
                    ({formatInteger(blocks)} {blocks === 1 ? 'block' : 'blocks'}
                    )
                  </span>
                </span>
              </ChartTooltipRow>
            </div>
          </>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}

const RATE_LABEL: Record<LiveMetric, string> = {
  uops: 'UOPS',
  tps: 'TPS',
  gas: 'Gas per second',
}
const TOTAL_LABEL: Record<LiveMetric, string> = {
  uops: 'Operations count',
  tps: 'Transactions count',
  gas: 'Gas used',
}
/** As stacked charts' tooltips put a share after a value */
const SECONDARY_VALUE =
  'whitespace-nowrap font-medium text-label-value-13 text-secondary tabular-nums sm:text-label-value-15'
const formatRate = (value: number) =>
  formatActivityCount(value, { decimals: value < 100 ? 1 : 0 })

/** The rate on the past week's range at this hour, low to high, with the median a tick on it */
function UsualBar({
  value,
  min,
  median,
  max,
  color,
}: {
  value: number
  min: number
  median: number
  max: number
  color: string
}) {
  const low = Math.min(min, value)
  const high = Math.max(max, value)
  const at = (v: number) =>
    `${high > low ? ((v - low) / (high - low)) * 100 : 50}%`
  const span = (a: number, b: number) => ({
    left: at(Math.min(a, b)),
    width: `calc(${at(Math.max(a, b))} - ${at(Math.min(a, b))})`,
  })
  // a line under it all, so the rate sits on it outside the range too, and
  // the rate's way from the median in the series' colour
  return (
    <div className="relative mx-1 h-2" aria-hidden>
      <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-px bg-divider" />
      <div
        className="-translate-y-1/2 absolute top-1/2 h-1 rounded-full bg-secondary/40"
        style={span(min, max)}
      />
      <div
        className="-translate-y-1/2 absolute top-1/2 h-0.5"
        style={{ ...span(median, value), backgroundColor: color }}
      />
      <div
        className="absolute inset-y-0 w-px bg-secondary"
        style={{ left: at(median) }}
      />
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-2 rounded-full"
        style={{ left: at(value), backgroundColor: color }}
      />
    </div>
  )
}

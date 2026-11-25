import { formatInteger } from '@l2beat/shared-pure'
import {
  ChartTooltipNote,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import { PercentChange } from '~/components/PercentChange'
import { formatRange } from '~/utils/dates'
import { LIVE_METRICS, type LiveMetric } from './liveMetrics'
import type { LiveRow } from './liveSteps'

/**
 * Laid out as the history's: the bucket's rate, with the past days' at this
 * hour under it, then the total it comes from
 */
export function LiveTooltip({
  row,
  metric,
  color,
}: {
  row: LiveRow
  metric: LiveMetric
  color: string
}) {
  const { value, blocks, usualMin, usualMedian, usualMax } = row
  const {
    rate,
    total,
    formatBucketRate: format,
    formatTotal,
  } = LIVE_METRICS[metric]
  return (
    <ChartTooltipWrapper>
      <div className="flex w-48 flex-col sm:w-64">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatRange(row.timestamp, row.end, { seconds: true })}
        </ChartTooltipTitle>
        {value === null ? (
          <span className="text-secondary">No blocks stored yet</span>
        ) : (
          <>
            <TooltipHeader label={rate} />
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
                    <ChartTooltipRow name="usualMedian">
                      <span className="flex items-baseline gap-1">
                        <ChartTooltipValue
                          value={usualMedian}
                          format={format}
                          className="tabular-nums"
                        />
                        <ChartTooltipNote className={NOTE_CLASS}>
                          ({format(usualMin)}–{format(usualMax)})
                        </ChartTooltipNote>
                      </span>
                    </ChartTooltipRow>
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
            <TooltipHeader className="mt-3" label={total} />
            <div className="mt-2 flex flex-col gap-2">
              <ChartTooltipRow name="value">
                <span className="flex items-baseline gap-1">
                  <ChartTooltipValue
                    value={value * (row.end - row.timestamp)}
                    format={formatTotal}
                    className="tabular-nums"
                  />
                  <ChartTooltipNote className={NOTE_CLASS}>
                    ({formatInteger(blocks)} {blocks === 1 ? 'block' : 'blocks'}
                    )
                  </ChartTooltipNote>
                </span>
              </ChartTooltipRow>
            </div>
          </>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}

const NOTE_CLASS = 'whitespace-nowrap tabular-nums'

/** The rate on the past days' range at this hour, low to high, with the median a tick on it */
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

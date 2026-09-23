import {
  CartesianGrid,
  DefaultZIndexes,
  ReferenceArea,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
} from 'recharts'
import { OUTSIDE_Y_AXIS_WIDTH, useChart } from './Chart'
import { NoDataPatternDef } from './defs/NoDataPatternDef'
import { getNiceAxisDomain } from './utils/getNiceAxisDomain'
import { getXAxisProps } from './utils/getXAxisProps'
import { trimTrailingZeros } from './utils/trimTrailingZeros'

export interface ChartCommonComponentsProps<
  T extends {
    timestamp: number
  },
> {
  data: T[] | undefined
  yAxis?: Omit<YAxisProps, 'tick'>
  xAxis?: Partial<XAxisProps>
  chartType?: 'bar' | 'line'
  isLoading: boolean | undefined
  syncedUntil: number | undefined
}

export function ChartCommonComponents<T extends { timestamp: number }>({
  data,
  yAxis,
  xAxis,
  isLoading,
  chartType = 'line',
  syncedUntil,
}: ChartCommonComponentsProps<T>) {
  const { axisPlacement } = useChart()
  const { tickCount = 3, yAxisId, ...rest } = yAxis ?? {}
  const lastSyncedTimestamp =
    syncedUntil &&
    (chartType === 'line'
      ? data?.findLast((d) => d.timestamp <= syncedUntil)
      : data?.find((d) => d.timestamp > syncedUntil)
    )?.timestamp

  return (
    <>
      <CartesianGrid
        key="cartesian-grid"
        vertical={false}
        syncWithTicks={!isLoading}
        yAxisId={yAxisId}
        // Labels inside the plot need the grid on top to stay readable over
        // filled series. With labels outside, the grid goes behind the data.
        zIndex={
          axisPlacement === 'inside' ? DefaultZIndexes.line + 1 : undefined
        }
      />
      <YAxis
        key="y-axis"
        tickLine={false}
        axisLine={false}
        tickCount={tickCount}
        tick={{ width: 350 }}
        yAxisId={yAxisId}
        {...(axisPlacement === 'inside'
          ? { mirror: true, dy: -10 }
          : { width: OUTSIDE_Y_AXIS_WIDTH })}
        {...rest}
        {...(axisPlacement === 'outside' && {
          ...getNiceDomainProps(rest.domain, tickCount),
          tickFormatter: (value, index) => {
            const label = rest.tickFormatter
              ? rest.tickFormatter(value, index)
              : String(value)
            return trimTrailingZeros(label)
          },
        })}
      />
      <XAxis
        key="x-axis"
        {...getXAxisProps(data)}
        {...(axisPlacement === 'outside' && { axisLine: true, tickMargin: 6 })}
        {...xAxis}
      />
      {lastSyncedTimestamp && (
        <ReferenceArea
          yAxisId={yAxis?.yAxisId}
          key="last-valid-timestamp"
          x1={lastSyncedTimestamp}
          fill="url(#noDataFill)"
        />
      )}
      {lastSyncedTimestamp && (
        <defs key="not-synced-defs">
          <NoDataPatternDef />
        </defs>
      )}
    </>
  )
}

/**
 * Rounds Recharts' default [0, 'auto'] and fully automatic ['auto', 'auto']
 * domains so every tick is a round value. Custom domains are left as is.
 */
function getNiceDomainProps(
  domain: YAxisProps['domain'],
  tickCount: number,
): Pick<YAxisProps, 'domain'> | undefined {
  const [min, max] = Array.isArray(domain) ? domain : [0, 'auto']
  if (typeof domain === 'function' || max !== 'auto') return
  if (min !== 0 && min !== 'auto') return

  return {
    domain: (dataDomain) =>
      getNiceAxisDomain(dataDomain, tickCount, { startAtZero: min === 0 }),
  }
}

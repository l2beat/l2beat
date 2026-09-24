import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  DefaultZIndexes,
  type NumberDomain,
  ReferenceArea,
  usePlotArea,
  useYAxisDomain,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
} from 'recharts'
import { useChart } from './Chart'
import { NoDataPatternDef } from './defs/NoDataPatternDef'
import {
  getEvenTicks,
  getNiceAxisDomain,
  type NiceTickScale,
} from './utils/getNiceAxisDomain'
import { getXAxisProps } from './utils/getXAxisProps'
import { trimTrailingZeros } from './utils/trimTrailingZeros'

export interface ChartCommonComponentsProps<
  T extends {
    timestamp: number
  },
> {
  data: T[] | undefined
  yAxis?: Omit<YAxisProps, 'tick'> & {
    /**
     * Unit the ticks are formatted in, which decides what counts as a round
     * step when the axis labels are `outside`. Defaults to `decimal`.
     */
    niceTicks?: NiceTickScale
  }
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
  const {
    tickCount: pageTickCount = 3,
    yAxisId,
    niceTicks = 'decimal',
    ...rest
  } = yAxis ?? {}
  // The outside placement is for a taller, standalone chart with room for
  // more ticks, which also lets them hug the data closer
  const tickCount =
    axisPlacement === 'outside' ? Math.max(pageTickCount, 5) : pageTickCount
  const niceDomain = useNiceDomain(rest.domain, tickCount, niceTicks, {
    enabled: axisPlacement === 'outside',
  })
  // Recharts would round steps like 768 MiB or 2m 30s to its own increments,
  // so the ticks of the rounded domain are passed explicitly
  const [niceTickValues, setNiceTickValues] = useState<number[]>()
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
          : { width: 'auto' })}
        {...rest}
        {...(axisPlacement === 'outside' && {
          ...(niceDomain && { domain: niceDomain, ticks: niceTickValues }),
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
      {niceDomain && (
        <ReportNiceTicks
          yAxisId={yAxisId}
          tickCount={tickCount}
          onChange={setNiceTickValues}
        />
      )}
      {axisPlacement === 'outside' && <ReportPlotArea />}
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
function useNiceDomain(
  domain: YAxisProps['domain'],
  tickCount: number,
  scale: NiceTickScale,
  { enabled }: { enabled: boolean },
) {
  const [min, max] = Array.isArray(domain) ? domain : [0, 'auto']
  const isAuto =
    enabled &&
    typeof domain !== 'function' &&
    max === 'auto' &&
    (min === 0 || min === 'auto')
  const startAtZero = min === 0

  // Stable, so Recharts does not recompute the axis on every render
  return useMemo(
    () =>
      isAuto
        ? (dataDomain: NumberDomain) =>
            getNiceAxisDomain(dataDomain, tickCount, { startAtZero, scale })
        : undefined,
    [isAuto, tickCount, startAtZero, scale],
  )
}

function isNumberDomain(domain: unknown): domain is NumberDomain {
  return (
    Array.isArray(domain) &&
    domain.length === 2 &&
    domain.every((value) => typeof value === 'number' && Number.isFinite(value))
  )
}

// Reads the rounded domain back from Recharts and spreads the ticks over it.
// A sibling of the YAxis on purpose: the YAxis pushes its settings to the
// chart store on every render, so a component that both renders it and
// subscribes to the store would re-render forever.
function ReportNiceTicks({
  yAxisId,
  tickCount,
  onChange,
}: {
  yAxisId: YAxisProps['yAxisId']
  tickCount: number
  onChange: (ticks: number[] | undefined) => void
}) {
  const domain = useYAxisDomain(yAxisId)
  const [min, max] = isNumberDomain(domain) ? domain : []

  useEffect(() => {
    onChange(
      min !== undefined && max !== undefined
        ? getEvenTicks([min, max], tickCount)
        : undefined,
    )
  }, [min, max, tickCount, onChange])

  return null
}

// Lets overlays outside the chart (milestones, logos) line up with the plot,
// whose left edge moves with the width of the y-axis labels.
function ReportPlotArea() {
  const plotArea = usePlotArea()
  const { setPlotArea } = useChart()
  const x = plotArea?.x
  const width = plotArea?.width

  useEffect(() => {
    if (x !== undefined && width !== undefined) setPlotArea?.({ x, width })
  }, [x, width, setPlotArea])

  return null
}

import type { ProjectScalingCategory } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type Ref, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  TimeSeriesChart,
  type TimeSeriesChartHandle,
} from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { getYAxisTicks } from '~/components/core/chart/utils/yAxisTicks'
import { LiveIndicator } from '~/components/LiveIndicator'
import type { UsualHour } from '~/server/features/layer2s/activity/live/liveWindow'
import { typeToColor } from '../ActivityChart'
import { ActivityRatioChart } from '../ActivityRatioChart'
import { getChartType } from '../utils/getChartType'
import { LiveTooltip } from './LiveTooltip'
import { hasHistory, LIVE_METRICS, type LiveMetric } from './liveMetrics'
import {
  closeSteps,
  type LiveBucket,
  toSteps,
  valueAt,
  withDashAnchor,
  withUsual,
} from './liveSteps'
import { formatBucket, formatTick, ticksOf } from './liveView'

const USUAL_MEDIAN = {
  label: 'Usual at this hour',
  color: 'var(--secondary)',
  indicatorType: { shape: 'line', strokeDasharray: '3 3' },
} satisfies ChartMeta[string]

export interface LiveChartHandle {
  /** Shows the charts as `seconds` after what they were drawn for */
  glide: (seconds: number) => void
}

/**
 * The window's buckets as steps, against the past days' range at each hour,
 * with the ratio of the two counts under it. A dot marks where the line of a
 * window scrolling with the clock meets the right edge
 */
export function LiveChart({
  ref,
  project,
  category,
  metric,
  buckets,
  bucket,
  usual,
  domain,
  lookahead,
  tick,
  head,
  isLoading,
  isPlaceholderData,
  onHover,
}: {
  ref: Ref<LiveChartHandle>
  project: ChartProject
  category: ProjectScalingCategory | undefined
  metric: LiveMetric
  buckets: LiveBucket[] | undefined
  /** Seconds per bucket */
  bucket: number
  usual: UsualHour[]
  domain: [number, number] | undefined
  /** Seconds drawn past the domain, for `glide` to bring in */
  lookahead: number
  /** Seconds between time ticks */
  tick: number
  /** Whether the dot shows */
  head: boolean
  isLoading: boolean
  isPlaceholderData: boolean
  onHover: (hovered: boolean) => void
}) {
  const main = useRef<TimeSeriesChartHandle>(null)
  const ratio = useRef<TimeSeriesChartHandle>(null)
  const dot = useRef<HTMLDivElement>(null)

  const rows =
    buckets &&
    domain &&
    closeSteps(
      withUsual(
        withDashAnchor(
          toSteps(buckets, bucket, [domain[0], domain[1] + lookahead]),
          domain[0],
        ),
        usual,
        metric,
      ),
      bucket,
    )
  const top = useSteadyTop(
    rows &&
      Math.max(
        ...rows.map((row) => Math.max(row.value ?? 0, row.usualMax ?? 0)),
      ),
  )
  const color =
    project.id === ProjectId.ETHEREUM
      ? 'var(--chart-ethereum)'
      : typeToColor(getChartType(category))
  const meta: ChartMeta = {
    value: {
      label: project.shortName ?? project.name,
      color,
      indicatorType: { shape: 'line' },
    },
    usualMedian: hasHistory(metric) ? USUAL_MEDIAN : undefined,
  }
  const xAxis = domain && {
    ticks: ticksOf(domain[0], domain[1] + lookahead, tick),
    format: formatTick,
    domain,
  }

  useImperativeHandle(ref, () => ({
    glide: (seconds) => {
      placeDot(
        dot.current,
        main.current?.getPlotRect(),
        rows && domain ? valueAt(rows, domain[1] + seconds) : null,
        top,
      )
      if (!domain) return
      for (const chart of [main.current, ratio.current]) {
        const plot = chart?.getPlotRect()
        if (!chart || !plot) continue
        chart.setXOffset((-seconds * plot.width) / (domain[1] - domain[0]))
      }
    },
  }))

  return (
    <div
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <div className="mt-4 mb-3">
        <ChartContainer
          data={rows}
          meta={meta}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          project={project}
          legend
        >
          <TimeSeriesChart
            data={rows ?? []}
            series={[
              {
                key: 'usual',
                value: (row) => row.usualMax,
                value0: (row) => row.usualMin,
                fill: USUAL_MEDIAN.color,
                fillOpacity: 0.15,
                curve: 'stepAfter',
                activeDot: false,
              },
              {
                key: 'usualMedian',
                value: (row) => row.usualMedian,
                stroke: USUAL_MEDIAN.color,
                strokeWidth: 1,
                strokeDasharray: USUAL_MEDIAN.indicatorType.strokeDasharray,
                curve: 'stepAfter',
                activeDot: false,
              },
              { key: 'value', ...tinted(color), curve: 'stepAfter' },
            ]}
            ariaLabel="Live activity"
            xAxis={xAxis}
            yAxis={{
              ...LIVE_METRICS[metric].axis,
              domain: top === undefined ? undefined : [0, top],
            }}
            // none on the right, so the line meets the dot at the edge
            margin={{ right: 0 }}
            clip
            hover="before"
            handleRef={main}
            renderTooltip={(row) => (
              <LiveTooltip
                row={row}
                bucket={bucket}
                metric={metric}
                color={color}
              />
            )}
          />
          {head && (
            <div
              ref={dot}
              className="pointer-events-none invisible absolute top-0 left-0"
            >
              <LiveIndicator
                color={color}
                className="-translate-x-1/2 -translate-y-1/2 ml-0 shrink-0"
              />
            </div>
          )}
        </ChartContainer>
      </div>
      {hasHistory(metric) && (
        <div className="mb-2">
          <ActivityRatioChart
            data={rows}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            syncedUntil={undefined}
            xAxis={xAxis}
            formatPeriod={(timestamp) => formatBucket(timestamp, bucket)}
            curve="stepAfter"
            clip
            hover="before"
            handleRef={ratio}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Puts the dot on the plot's right edge, at `value` on a y axis from 0 to
 * `top`, and hides it without one. Moved only when it would look different,
 * as it is placed every frame
 */
function placeDot(
  dot: HTMLElement | null,
  plot: ReturnType<TimeSeriesChartHandle['getPlotRect']>,
  value: number | null,
  top: number | undefined,
) {
  if (!dot) return
  if (!plot || value === null || top === undefined || top <= 0) {
    dot.style.visibility = 'hidden'
    return
  }
  const x = Math.round(plot.x + plot.width)
  const y = Math.round(plot.y + (1 - Math.min(value, top) / top) * plot.height)
  const transform = `translate(${x}px, ${y}px)`
  if (dot.style.transform !== transform) dot.style.transform = transform
  dot.style.visibility = 'visible'
}

/**
 * Holds the axis' top, the chart's own for the values, while they fit well
 * under it, so the chart does not rescale on every read
 */
function useSteadyTop(max: number | undefined) {
  const committed = useRef<number | undefined>(undefined)
  const held = committed.current
  const top =
    max !== undefined && (held === undefined || max > held || max < held * 0.4)
      ? getYAxisTicks([0, max], {}, 1).domain[1]
      : held
  useLayoutEffect(() => {
    committed.current = top
  })
  return top
}

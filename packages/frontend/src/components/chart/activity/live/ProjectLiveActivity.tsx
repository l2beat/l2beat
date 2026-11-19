import type { ProjectScalingCategory } from '@l2beat/config'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { formatTimestamp } from '~/utils/dates'
import {
  LIVE_BUFFER_RANGE,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
} from '~/utils/range/liveRanges'
import { LiveChart, type LiveChartHandle } from './LiveChart'
import { LiveOverview } from './LiveOverview'
import { LiveState } from './LiveState'
import { LiveStats } from './LiveStats'
import { hasHistory, type LiveMetric } from './liveMetrics'
import { getUsualRate, getWindowStats, toBuckets } from './liveSteps'
import { useLiveWindow } from './useLiveWindow'

/**
 * The chain's blocks of the last hours, laid out as the history: a window of
 * them, following the newest block until looked back, with the whole buffer
 * below to pick it from
 */
export function ProjectLiveActivity({
  project,
  category,
  metric,
  setMetric,
  oldest,
  stateSlot,
}: {
  project: ChartProject
  category: ProjectScalingCategory | undefined
  metric: LiveMetric
  setMetric: (metric: LiveMetric) => void
  /** Of the oldest stored block, before which nothing is known */
  oldest: number | undefined
  /** Where it shows whether it follows the newest block, beside the view's switch */
  stateSlot: HTMLElement | null
}) {
  const chart = useRef<LiveChartHandle>(null)
  const live = useLiveWindow({
    projectId: project.id,
    onGlide: (seconds) => chart.current?.glide(seconds),
  })
  const { data, domain, range, selection } = live
  const buckets = useMemo(
    () => data && toBuckets(data.window, data.buckets, metric, oldest),
    [data, metric, oldest],
  )
  const state =
    stateSlot &&
    createPortal(
      <LiveState following={live.following} onFollow={live.follow} />,
      stateSlot,
    )

  if (!data && live.isError) {
    return (
      <>
        {state}
        <p className="py-12 text-center text-secondary">
          Live activity can't be read right now.
        </p>
      </>
    )
  }

  const bucket = data?.window.bucket ?? 1
  const stats = buckets && domain && getWindowStats(buckets, bucket, domain)

  return (
    <div className="flex flex-col">
      {state}
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          timeRange={domain}
          isPlaceholderData={live.isPlaceholderData}
        />
        <RadioGroup
          name="liveActivityRange"
          value={range}
          onValueChange={(value) => {
            const next = LIVE_RANGE_KEYS.find((key) => key === value)
            if (next) live.setRange(next)
          }}
        >
          {LIVE_RANGE_KEYS.map((value) => (
            <RadioGroupItem key={value} value={value}>
              {value.toUpperCase()}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </ChartControlsWrapper>
      <LiveChart
        ref={chart}
        project={project}
        category={category}
        metric={metric}
        buckets={buckets}
        bucket={bucket}
        usual={data?.usual ?? []}
        domain={domain}
        lookahead={live.lookahead}
        tick={LIVE_RANGES[live.shown].tick}
        head={live.scrolling && !live.stale}
        isLoading={live.isLoading}
        isPlaceholderData={live.stale}
        onHover={live.setHovered}
      />
      {data && selection && (
        <div className="mb-4 flex flex-col gap-1">
          <span className="font-normal text-label-value-13 text-secondary">
            {data.buffer.filling
              ? `Since ${formatTimestamp(data.buffer.from, { mode: 'time' })}`
              : `Last ${LIVE_RANGES[LIVE_BUFFER_RANGE].label}`}
            , a bar a minute. Press or drag to look back
          </span>
          <LiveOverview
            overview={data.overview}
            buffer={data.buffer}
            selection={selection}
            selectionText={live.selectionText}
            length={LIVE_RANGES[range].seconds}
            metric={metric}
            onSeek={live.seek}
            onMove={live.moveTo}
          />
        </div>
      )}
      <ActivityMetricControls
        value={metric}
        onValueChange={setMetric}
        className="self-start"
      >
        <RadioGroupItem value="gas">GAS</RadioGroupItem>
      </ActivityMetricControls>
      <LiveStats
        usual={
          hasHistory(metric) && data && stats
            ? // over the buckets the rate is
              getUsualRate(data.usual, metric, [stats.from, stats.to])
            : undefined
        }
        metric={metric}
        stats={stats}
        span={live.following ? live.shown : domain}
        isLoading={live.isLoading}
      />
    </div>
  )
}

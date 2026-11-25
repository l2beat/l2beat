import type { ProjectScalingCategory } from '@l2beat/config'
import { formatSeconds } from '@l2beat/shared-pure'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { formatTimestamp, parseTimestamp } from '~/utils/dates'
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
  stateSlot,
}: {
  project: ChartProject
  category: ProjectScalingCategory | undefined
  metric: LiveMetric
  setMetric: (metric: LiveMetric) => void
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
    () => data && toBuckets(data.window, data.buckets, metric, data.oldest),
    [data, metric],
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
        <div className="mb-4">
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
          <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4 font-medium text-label-value-12 text-secondary">
            <span className="whitespace-nowrap">
              {data.buffer.filling
                ? formatTimestamp(data.buffer.from, { mode: 'time' })
                : `${LIVE_RANGES[LIVE_BUFFER_RANGE].label} ago`}
            </span>
            {live.lookingBack ? (
              <span className="text-center">
                <span className="text-primary tabular-nums">
                  {formatTime(selection[1])}
                </span>
                <span className="max-md:hidden">
                  {' '}
                  · {formatAgo(data.buffer.to - selection[1])}
                </span>
              </span>
            ) : (
              <span className="min-w-0 truncate text-center max-md:hidden">
                A bar a minute. Press or drag to look back
              </span>
            )}
            {live.following ? (
              <span className="col-start-3 justify-self-end whitespace-nowrap">
                Now
              </span>
            ) : (
              <button
                type="button"
                onClick={live.follow}
                className="col-start-3 justify-self-end whitespace-nowrap font-medium text-brand-deep underline-offset-[0.3em] hover:underline"
              >
                Back to live
              </button>
            )}
          </div>
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

function formatTime(timestamp: number) {
  const { time, seconds } = parseTimestamp(timestamp)
  return `${time}:${seconds} UTC`
}

/** Past a minute in whole minutes, as the seconds would change on every move */
function formatAgo(seconds: number) {
  return `${formatSeconds(seconds < 60 ? seconds : Math.floor(seconds / 60) * 60)} ago`
}

import type { ProjectScalingCategory } from '@l2beat/config'
import { useMemo, useRef, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  DEFAULT_LIVE_RANGE,
  getLiveBucketSeconds,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
  type LiveRange,
} from '~/server/features/layer2s/activity/live/liveRanges'
import { formatRange } from '~/utils/dates'
import { LiveChart, type LiveChartHandle } from './LiveChart'
import { LiveOverview } from './LiveOverview'
import { LiveStats } from './LiveStats'
import {
  getUsualRate,
  getWindowStats,
  type LiveMetric,
  toBuckets,
} from './liveSteps'
import { clampTo, formatTick } from './liveView'
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
  to,
  setTo,
  oldest,
}: {
  project: ChartProject
  category: ProjectScalingCategory | undefined
  metric: LiveMetric
  setMetric: (metric: LiveMetric) => void
  /** Where the window ends, undefined while following the newest block */
  to: number | undefined
  setTo: (to: number | undefined) => void
  /** Of the oldest stored block, before which nothing is known */
  oldest: number | undefined
}) {
  const [range, setRange] = useState<LiveRange>(DEFAULT_LIVE_RANGE)
  // while the window is moved on the overview, before it is read
  const [seeking, setSeeking] = useState(false)
  const [hovered, setHovered] = useState(false)
  const chart = useRef<LiveChartHandle>(null)
  const {
    data,
    isLoading,
    isPlaceholderData,
    isError,
    shown,
    domain,
    scrolling,
    lookahead,
  } = useLiveWindow({
    projectId: project.id,
    range,
    to,
    hovered,
    onGlide: (seconds) => chart.current?.glide(seconds),
  })
  const buckets = useMemo(
    () => data && toBuckets(data.window, data.buckets, metric, oldest),
    [data, metric, oldest],
  )

  if (!data && isError) {
    return (
      <p className="py-12 text-center text-secondary">
        Live activity can't be read right now.
      </p>
    )
  }

  const live = to === undefined
  const { seconds } = LIVE_RANGES[range]
  const bucket = data?.window.bucket ?? 1
  const stats = buckets && domain && getWindowStats(buckets, bucket, domain)
  // the range's own until it is read: a move rounded to another range's
  // would be read again once rounded to this one's
  const readBucket =
    data?.window.range === range ? bucket : getLiveBucketSeconds(range)

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          timeRange={domain}
          isPlaceholderData={isPlaceholderData}
        />
        <RadioGroup
          name="liveActivityRange"
          value={range}
          onValueChange={(value) => {
            const next = LIVE_RANGE_KEYS.find((key) => key === value)
            if (!next) return
            setRange(next)
            setTo(clampTo(to, data?.buffer, LIVE_RANGES[next].seconds))
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
        lookahead={lookahead}
        tick={LIVE_RANGES[shown].tick}
        head={scrolling && !seeking && !isPlaceholderData}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData || seeking}
        onHover={setHovered}
      />
      {data?.buffer && domain && (
        <div className="mb-4 flex flex-col gap-1">
          <span className="font-normal text-label-value-13 text-secondary">
            {data.buffer.filling
              ? `Since ${formatTick(data.buffer.from)}`
              : 'Last 4 hours'}
            , a bar a minute. Press or drag to look back
          </span>
          <LiveOverview
            overview={data.overview}
            buffer={data.buffer}
            // where it was asked to end while that is read, not where it was
            window={
              to !== undefined && isPlaceholderData
                ? [to - seconds, to]
                : domain
            }
            windowText={
              live
                ? 'Live'
                : formatRange(domain[0], domain[1], { seconds: true })
            }
            length={seconds}
            metric={metric}
            // on a bucket, so moves within one share a read
            onMove={(end) =>
              setTo(clampTo(end - (end % readBucket), data.buffer, seconds))
            }
            onSeeking={setSeeking}
          />
        </div>
      )}
      <RadioGroup
        name="liveActivityMetric"
        value={metric}
        onValueChange={(value) => setMetric(value as LiveMetric)}
        variant="highlighted"
        className="self-start"
      >
        {(['uops', 'tps', 'gas'] as const).map((value) => (
          <RadioGroupItem
            key={value}
            value={value}
            className="h-full px-[6px] text-sm uppercase"
          >
            {value}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <LiveStats
        usual={
          metric !== 'gas' && data && stats
            ? // over the buckets the rate is
              getUsualRate(data.usual, metric, [stats.from, stats.to])
            : undefined
        }
        metric={metric}
        stats={stats}
        window={live ? shown : domain}
        isLoading={isLoading}
      />
    </div>
  )
}

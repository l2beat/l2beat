import { useMemo, useState } from 'react'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { HeadBlock, TodaySoFar } from '../../../live/types'
import { formatBlockNumber } from '../format'
import { dayOf } from '../metrics'
import { useAnchor } from '../state/anchor'
import {
  RANGES,
  type Range,
  recentMean,
  series,
  useHistory,
} from '../state/history'
import { DailyChart } from './DailyChart'
import { Segmented } from './Section'

export interface Metric {
  id: string
  label: string
  pick: (p: DailyPoint) => number
  /** Today's partial value from the running totals, as of the anchored block */
  today?: (t: TodaySoFar, block: HeadBlock) => number | undefined
  format: (value: number) => string
  kind: 'bucket' | 'snapshot'
  scale?: 'linear' | 'log'
  baseline?: 'zero' | 'auto'
  todayNote?: string
}

/**
 * Daily history for one or more metrics, ending on today so far as it stood
 * at the anchored block. The stat under it uses complete days only, so a
 * partial day never drags an average down.
 */
export function HistoryChart({
  metrics,
  defaultRange = '1y',
  withUpgrades = false,
  height = 200,
}: {
  metrics: Metric[]
  defaultRange?: Range
  withUpgrades?: boolean
  height?: number
}) {
  const history = useHistory()
  const { today, block } = useAnchor()
  const [metricId, setMetricId] = useState(metrics[0]?.id ?? '')
  const [range, setRange] = useState<Range>(defaultRange)
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0]

  const points = useMemo(
    () => (metric ? series(history, range, metric.pick) : []),
    [history, range, metric],
  )
  if (!metric) return null

  const todayValue = today && block && metric.today?.(today, block)
  const todayPoint =
    today && todayValue !== undefined && Number.isFinite(todayValue)
      ? { t: today.startedAt, v: todayValue }
      : undefined
  const mean = recentMean(history, metric.pick)
  const lastDay = history.at(-1)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {metrics.length > 1 ? (
          <Segmented
            label="Metric"
            options={metrics.map((m) => ({ id: m.id, label: m.label }))}
            value={metric.id}
            onChange={setMetricId}
          />
        ) : (
          <span className="font-medium text-label-value-14">
            {metric.label}
          </span>
        )}
        <Segmented
          label="Range"
          options={RANGES}
          value={range}
          onChange={setRange}
        />
      </div>
      <DailyChart
        points={points}
        today={todayPoint}
        highlightDay={block ? dayOf(block.timestamp) : undefined}
        highlightLabel={
          block?.number !== undefined
            ? formatBlockNumber(block.number)
            : undefined
        }
        format={metric.format}
        kind={metric.kind}
        scale={metric.scale}
        baseline={metric.baseline}
        upgrades={withUpgrades ? UPGRADES : undefined}
        height={height}
        seriesName={metric.label}
        todayNote={metric.todayNote}
      />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-label-value-12 text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-chart-ethereum" />
          Complete days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-chart-ethereum" />
          Today so far
        </span>
        {metric.kind === 'bucket' && mean !== undefined && (
          <span className="tabular-nums">
            30-day average{' '}
            <span className="font-medium text-primary">
              {metric.format(mean)}
            </span>
          </span>
        )}
        {metric.kind === 'snapshot' && lastDay && (
          <span className="tabular-nums">
            At the end of yesterday{' '}
            <span className="font-medium text-primary">
              {metric.format(metric.pick(lastDay))}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

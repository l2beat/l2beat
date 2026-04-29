import type { AggregatedAnomalyRow } from '../../types'
import { Sparkline } from '../Sparkline'
import { MetricLine } from './MetricLine'

export function MiniChartsCell(props: { row: AggregatedAnomalyRow }) {
  const seriesPoints =
    props.row.rawDataPoints.length > 0
      ? props.row.rawDataPoints
      : props.row.dataPoints
  const countValues = seriesPoints.map(
    (point: AggregatedAnomalyRow['dataPoints'][number]) => point.transferCount,
  )
  const srcVolumeValues = seriesPoints.map(
    (point: AggregatedAnomalyRow['dataPoints'][number]) =>
      point.totalSrcValueUsd,
  )
  const dstVolumeValues = seriesPoints.map(
    (point: AggregatedAnomalyRow['dataPoints'][number]) =>
      point.totalDstValueUsd,
  )
  const countDomain = {
    min: 0,
    max: maxOrZero(countValues),
  }
  const volumeDomain = {
    min: 0,
    max: maxOrZero([...srcVolumeValues, ...dstVolumeValues]),
  }

  return (
    <div className="min-w-[140px]">
      <MetricLine>
        Count{' '}
        <span style={{ color: 'var(--color-chart-3)', fontWeight: 600 }}>
          ●
        </span>
      </MetricLine>
      <div className="rounded bg-muted/60">
        <Sparkline
          values={countValues}
          color="var(--color-chart-3)"
          domain={countDomain}
        />
      </div>
      <MetricLine>
        Vol{' '}
        <span style={{ color: 'var(--color-chart-1)', fontWeight: 600 }}>
          S
        </span>{' '}
        /
        <span style={{ color: 'var(--color-chart-5)', fontWeight: 600 }}>
          {' '}
          D
        </span>
      </MetricLine>
      <div className="relative rounded bg-muted/60">
        <Sparkline
          values={srcVolumeValues}
          color="var(--color-chart-1)"
          domain={volumeDomain}
        />
        <div className="pointer-events-none absolute inset-0">
          <Sparkline
            values={dstVolumeValues}
            color="var(--color-chart-5)"
            domain={volumeDomain}
          />
        </div>
      </div>
    </div>
  )
}

function maxOrZero(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return Math.max(...values)
}

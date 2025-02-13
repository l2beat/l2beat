'use client'

import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { calculate30DayRollingStats } from './calculate30DayRollingStats'
import { calculateIntervals } from './calculateIntervals'
import type { ChartDataPoint } from './chart'
import { AnomalyChart } from './chart'

const to = UnixTime.now().toStartOf('hour')

export function AnomaliesSection({ projectId }: { projectId: ProjectId }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/liveness-txs/${projectId}?subtype=stateUpdates`,
      )
      const data = (await res.json()) as {
        data: {
          timestamps: number[]
        }
      }
      const timestamps = data.data.timestamps.map(
        (ts: number) => new UnixTime(ts),
      )

      const intervals = calculateIntervals(timestamps)

      const lastIndex = intervals.findIndex((interval) =>
        interval.timestamp.lte(to.add(-1 * 30, 'days')),
      )

      const { means, stdDeviations } = calculate30DayRollingStats(
        intervals,
        0,
        lastIndex,
        to,
      )

      const currentRange = intervals.slice(0, lastIndex)

      const chart: ChartDataPoint[] = currentRange.map((interval) => {
        const point = interval.timestamp.toStartOf('minute').toNumber()
        const mean = means.get(point)
        const stdDev = stdDeviations.get(
          interval.timestamp.toStartOf('minute').toNumber(),
        )

        assert(mean !== undefined, 'Mean should not be undefined')
        assert(stdDev !== undefined, 'StdDev should not be undefined')

        const z = (interval.duration - mean) / stdDev
        const isAnomaly = z >= 15 && interval.duration > mean

        return {
          timestamp: interval.timestamp.toNumber() * 1000,
          duration: interval.duration,
          mean: mean,
          zScoreBoundary: 15 * stdDev + mean,
          anomaly: isAnomaly ? interval.duration : null,
        }
      })

      setChartData(chart)
    }
    fetchData()
      .catch(() => {
        console.log('calculated')
      })
      .catch((e) => console.log(e))
  }, [projectId])

  if (chartData.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="mt-10">
      <AnomalyChart data={chartData} />
    </div>
  )
}

import type { DaLayerThroughput } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { ProjectDaThroughputChartPoint } from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import type { ChartResolution } from '~/utils/range/range'
import type { ProjectChartDataWithConfiguredThroughput } from './ProjectDaAbsoluteThroughputChart'

export function getDataWithConfiguredThroughputs(
  data: ProjectDaThroughputChartPoint[] | undefined,
  configuredThroughputs: DaLayerThroughput[],
  resolution: ChartResolution,
): ProjectChartDataWithConfiguredThroughput[] | undefined {
  const processedConfigs = configuredThroughputs
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .map((config, i, arr) => {
      const batchesPerDay = UnixTime.DAY / config.frequency
      const nextConfig = arr[i + 1]
      return {
        ...config,
        sinceTimestamp: UnixTime.toStartOf(config.sinceTimestamp, 'day'),
        untilTimestamp: nextConfig
          ? UnixTime.toStartOf(nextConfig.sinceTimestamp, 'day')
          : Number.POSITIVE_INFINITY,
        maxDaily: config.size === 'NO_CAP' ? null : config.size * batchesPerDay,
        targetDaily: config.target ? config.target * batchesPerDay : null,
      }
    })

  return data?.map(([timestamp, value]) => {
    const config = processedConfigs.find(
      (c) => timestamp >= c.sinceTimestamp && timestamp < c.untilTimestamp,
    )

    return [
      timestamp,
      value,
      adjustThoughputToRange(resolution, config?.targetDaily),
      adjustThoughputToRange(resolution, config?.maxDaily),
    ]
  })
}

function adjustThoughputToRange(
  resolution: ChartResolution,
  throughput: number | null | undefined,
) {
  if (!throughput) return null

  switch (resolution) {
    case 'hour':
      return throughput / 24
    case 'six hours':
      return throughput / 4
    default:
      return throughput
  }
}

import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { groupByTimestampAndDaLayerId } from './getDaThroughputChart'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'

export const DaThroughputSummaryParams = v.object({
  to: v.number().optional(),
})
export type DaThroughputSummaryParams = v.infer<
  typeof DaThroughputSummaryParams
>

export async function getDaThroughputSummary(
  params?: DaThroughputSummaryParams,
) {
  if (env.MOCK) {
    return getMockDaThroughputSummaryData()
  }
  return await getDaThroughputSummaryData(params)
}

export type ThroughputSummaryData = Awaited<
  ReturnType<typeof getDaThroughputSummaryData>
>
const getDaThroughputSummaryData = async (
  params?: DaThroughputSummaryParams,
) => {
  const db = getDb()
  const to = params?.to ?? UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - 7 * UnixTime.DAY
  const throughput = await db.dataAvailability.getByDaLayersAndTimeRange(
    THROUGHPUT_ENABLED_DA_LAYERS,
    [from, to],
  )

  const scalingOnlyRecords = throughput.filter((r) => r.daLayer !== r.projectId)
  if (scalingOnlyRecords.length === 0) {
    return undefined
  }

  const { grouped, minTimestamp } = groupByTimestampAndDaLayerId(
    scalingOnlyRecords,
    'daily',
  )

  const lastDataForLayers: Record<
    string,
    { timestamp: number; value: number }
  > = {}
  for (const layer of THROUGHPUT_ENABLED_DA_LAYERS) {
    const lastValue = Object.entries(grouped).findLast(
      ([_, values]) => values[layer] !== undefined,
    )
    if (lastValue) {
      const [timestamp, value] = lastValue
      lastDataForLayers[layer] = {
        timestamp: Number(timestamp),
        value: value[layer] ?? 0,
      }
    }
  }

  const maxTimestamp = Math.max(
    ...Object.values(lastDataForLayers).map(({ timestamp }) => timestamp),
  )

  return {
    latest: {
      ethereum: lastDataForLayers?.ethereum?.value ?? 0,
      celestia: lastDataForLayers?.celestia?.value ?? 0,
      avail: lastDataForLayers?.avail?.value ?? 0,
      eigenda: lastDataForLayers?.eigenda?.value ?? 0,
    },
    data7dAgo: {
      ethereum: grouped[minTimestamp]?.ethereum ?? 0,
      celestia: grouped[minTimestamp]?.celestia ?? 0,
      avail: grouped[minTimestamp]?.avail ?? 0,
      eigenda: grouped[minTimestamp]?.eigenda ?? 0,
    },
    estimatedLayers: Object.entries(lastDataForLayers)
      .filter(([_, { timestamp }]) => timestamp < maxTimestamp)
      .map(([layer]) => layer),
  }
}

function getMockDaThroughputSummaryData(): ThroughputSummaryData {
  return {
    latest: {
      ethereum: 4000000,
      celestia: 4000000,
      avail: 4000000,
      eigenda: 4000000,
    },
    data7dAgo: {
      ethereum: 100000,
      celestia: 100000,
      avail: 100000,
      eigenda: 100000,
    },
    estimatedLayers: ['eigenda'],
  }
}

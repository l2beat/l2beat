import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { groupByTimestampAndDaLayerId } from './get-da-throughput-chart'

export async function getDaThroughputSummary() {
  if (env.MOCK) {
    return getMockDaThroughputSummaryData()
  }
  return getCachedDaThroughputSummaryData()
}

export type ThroughputSummaryData = Awaited<
  ReturnType<typeof getCachedDaThroughputSummaryData>
>
const getCachedDaThroughputSummaryData = cache(
  async () => {
    await using db = getDb()
    const to = UnixTime.now().toStartOf('day').add(-1, 'days')
    const from = to.add(-7, 'days')
    const throughput = await db.dataAvailability.getByProjectIdsAndTimeRange(
      ['ethereum', 'celestia', 'avail'],
      [from, to],
    )
    if (throughput.length === 0) {
      return undefined
    }
    const { grouped, minTimestamp, maxTimestamp } =
      groupByTimestampAndDaLayerId(throughput)

    return {
      latest: {
        ethereum: grouped[maxTimestamp.toNumber()]?.ethereum ?? 0,
        celestia: grouped[maxTimestamp.toNumber()]?.celestia ?? 0,
        avail: grouped[maxTimestamp.toNumber()]?.avail ?? 0,
      },
      data7dAgo: {
        ethereum: grouped[minTimestamp.toNumber()]?.ethereum ?? 0,
        celestia: grouped[minTimestamp.toNumber()]?.celestia ?? 0,
        avail: grouped[minTimestamp.toNumber()]?.avail ?? 0,
      },
    }
  },
  ['da-throughput-summary-data'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function getMockDaThroughputSummaryData(): ThroughputSummaryData {
  return {
    latest: {
      ethereum: 200000,
      celestia: 200000,
      avail: 200000,
    },
    data7dAgo: {
      ethereum: 100000,
      celestia: 100000,
      avail: 100000,
    },
  }
}

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { getDb } from 'rewrite/src/server/database'
import { env } from '~/env'
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
    const db = getDb()
    const to = UnixTime.toStartOf(UnixTime.now(), 'day') - 1 * UnixTime.DAY
    const from = to - 7 * UnixTime.DAY
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
        ethereum: grouped[maxTimestamp]?.ethereum ?? 0,
        celestia: grouped[maxTimestamp]?.celestia ?? 0,
        avail: grouped[maxTimestamp]?.avail ?? 0,
      },
      data7dAgo: {
        ethereum: grouped[minTimestamp]?.ethereum ?? 0,
        celestia: grouped[minTimestamp]?.celestia ?? 0,
        avail: grouped[minTimestamp]?.avail ?? 0,
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

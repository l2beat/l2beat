import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaThroughputLastTimestamp(daLayerId: string) {
  if (env.MOCK) {
    return getMockDaThroughputTableData()
  }
  return await getDaThroughputLastTimestampData(daLayerId)
}

export type ThroughputLastTimestamp = Awaited<
  ReturnType<typeof getDaThroughputLastTimestampData>
>
const getDaThroughputLastTimestampData = async (daLayerId: string) => {
  const db = getDb()
  const lastHour = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const values = await db.dataAvailability.getByDaLayersAndTimeRange(
    [daLayerId],
    [lastHour - 7 * UnixTime.HOUR, lastHour],
  )

  return values.at(-1)?.timestamp
}

function getMockDaThroughputTableData(): ThroughputLastTimestamp {
  return UnixTime.now()
}

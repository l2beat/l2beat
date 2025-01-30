import type { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { getAmountsStatus } from '../../sync-status/get-amounts-status'

interface Params {
  configurations: (AmountConfigEntry & {
    configId: string
  })[]
  range: [UnixTime, UnixTime]
  timestamps: UnixTime[]
}

export async function getTokenAmounts({
  configurations,
  range,
  timestamps,
}: Params) {
  const db = getDb()
  const [from, to] = range
  const amountRecords = await db.amount.getByConfigIdsInRange(
    configurations.map((c) => c.configId),
    from,
    to,
  )
  const status = await getAmountsStatus(configurations, to)

  const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

  const aggregatedByTimestamp: Record<string, bigint> = {}
  for (const timestamp of timestamps) {
    const amounts = amountsByTimestamp[timestamp.toString()] ?? []

    const interpolatedRecords = status.lagging
      .filter((l) => timestamp.gt(l.latestTimestamp))
      .map((l) => {
        const amount =
          amountsByTimestamp[l.latestTimestamp.toString()]?.find(
            (a) => a.configId === l.id,
          )?.amount ?? 0n
        return { amount }
      })

    const aggregatedAmount = [
      ...amounts.filter((a) => !status.excluded.has(a.configId)),
      ...interpolatedRecords,
    ].reduce((acc, curr) => acc + curr.amount, 0n)

    aggregatedByTimestamp[timestamp.toString()] = aggregatedAmount
  }

  return {
    amounts: aggregatedByTimestamp,
    laggingFrom: new Map<string, UnixTime>(
      status.lagging.map((l) => [l.id, l.latestTimestamp]),
    ),
    excluded: status.excluded,
  }
}

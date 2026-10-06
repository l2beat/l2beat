import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getThroughputInForce } from './utils/getThroughputInForce'

export const DaPastDayUsageParams = v.object({
  daLayerId: v.string(),
})
export type DaPastDayUsageParams = v.infer<typeof DaPastDayUsageParams>

export interface DaPastDayUsage {
  /**
   * Bytes anyone posted to the DA layer over the day, tracked project or not.
   * Undefined when the indexer is too far behind to tell
   */
  used: number | undefined
  /** Bytes the DA layer has room for over the day. Undefined when it has no cap */
  capacity: number | undefined
}

type PostedRecord = Pick<
  DataAvailabilityRecord,
  'projectId' | 'timestamp' | 'totalSize'
>

export async function getDaPastDayUsage({
  daLayerId,
}: DaPastDayUsageParams): Promise<DaPastDayUsage> {
  const today = UnixTime.toStartOf(UnixTime.now(), 'day')
  const daLayer = await ps.getProject({
    id: ProjectId(daLayerId),
    select: ['daLayer'],
  })
  const throughput = daLayer?.daLayer.throughput ?? []

  if (env.MOCK) {
    const yesterday: [number, number] = [today - UnixTime.DAY, today]
    const capacity = getCapacity(daLayerId, throughput, yesterday)
    return { used: Math.round((capacity ?? 1e9) * 0.8), capacity }
  }

  // two days, so that a whole one is at hand while the indexer lags
  const fetched: [number, number] = [today - 2 * UnixTime.DAY, today]
  const records = await getDb().dataAvailability.getByDaLayersAndTimeRange(
    [daLayerId],
    fetched,
  )
  const day = getSyncedDay(records, daLayerId, fetched)
  if (!day) return { used: undefined, capacity: undefined }

  return {
    used: sumUsed(records, daLayerId, day),
    capacity: getCapacity(daLayerId, throughput, day),
  }
}

/**
 * The newest 24 hours the indexer has written, [from, to), out of the range
 * the records were fetched for. Records are hourly and the indexer can lag,
 * so a day that simply ended at midnight would count the hours not written
 * yet as empty. Undefined when the range does not hold a whole day up to the
 * last record.
 */
export function getSyncedDay(
  records: PostedRecord[],
  daLayerId: string,
  [fetchedFrom, fetchedTo]: [number, number],
): [number, number] | undefined {
  const hours = records
    .filter((r) => r.projectId === daLayerId && r.timestamp < fetchedTo)
    .map((r) => r.timestamp)
  if (hours.length === 0) return undefined

  const to = Math.max(...hours) + UnixTime.HOUR
  const from = to - UnixTime.DAY
  return from >= fetchedFrom ? [from, to] : undefined
}

/** Everything posted to the DA layer, which it keeps under its own id */
export function sumUsed(
  records: PostedRecord[],
  daLayerId: string,
  [from, to]: [number, number],
): number {
  return records
    .filter(
      (r) =>
        r.projectId === daLayerId && r.timestamp >= from && r.timestamp < to,
    )
    .reduce((sum, r) => sum + Number(r.totalSize), 0)
}

/**
 * Room the DA layer had over the range, by the limits in force when the
 * range started. Ethereum is measured against its blob target rather than
 * its maximum: posting above the target cannot be sustained, since the blob
 * fee keeps rising for as long as it lasts.
 */
export function getCapacity(
  daLayerId: string,
  throughput: DaLayerThroughput[],
  [from, to]: [number, number],
): number | undefined {
  const inForce = getThroughputInForce(throughput, from)
  if (!inForce) return undefined

  const size = daLayerId === ProjectId.ETHEREUM ? inForce.target : inForce.size
  if (size === undefined || size === 'NO_CAP') return undefined

  return (size / inForce.frequency) * (to - from)
}

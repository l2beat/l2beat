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

type PostedRecord = Pick<DataAvailabilityRecord, 'timestamp' | 'totalSize'>

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

  // Everything posted to the layer is kept under its own id. Two days back,
  // so that a whole one is at hand while the indexer lags, and through today,
  // so that yesterday's last hour can be told complete
  const earliest = today - 2 * UnixTime.DAY
  const records = await getDb().dataAvailability.getByProjectIdsAndTimeRange(
    [daLayerId],
    [earliest, today + UnixTime.DAY],
  )
  const day = getSyncedDay(records, [earliest, today])
  if (!day) return { used: undefined, capacity: undefined }

  return {
    used: sumUsed(records, day),
    capacity: getCapacity(daLayerId, throughput, day),
  }
}

/**
 * Yesterday, or when the indexer lags, the newest 24 whole hours it has
 * written, as [from, to). Records are hourly and the newest one is still
 * being written: the indexer adds blobs to it batch by batch, so it is only
 * complete once the next hour has started. Undefined when the records do not
 * reach a whole day back from there.
 */
export function getSyncedDay(
  records: PostedRecord[],
  [earliest, dayEnd]: [number, number],
): [number, number] | undefined {
  if (records.length === 0) return undefined

  const newest = Math.max(...records.map((r) => r.timestamp))
  const to = Math.min(newest, dayEnd)
  const from = to - UnixTime.DAY
  return from >= earliest ? [from, to] : undefined
}

export function sumUsed(
  records: PostedRecord[],
  [from, to]: [number, number],
): number {
  return records
    .filter((r) => r.timestamp >= from && r.timestamp < to)
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

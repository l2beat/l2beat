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
  /** Bytes, tracked project or not. Undefined when the indexer is too far behind */
  used: number | undefined
  /** Bytes. Undefined when the layer has no cap */
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
 * The newest 24 complete hours, as [from, to). The newest hourly record is
 * still being written batch by batch, so it is complete only once the next
 * hour has started.
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
 * Ethereum is measured against its blob target, not its maximum: posting above
 * the target cannot be sustained, as the blob fee keeps rising while it lasts.
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

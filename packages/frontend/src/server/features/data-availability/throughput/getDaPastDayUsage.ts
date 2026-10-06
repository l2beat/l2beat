import type { DaLayerThroughput } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export const DaPastDayUsageParams = v.object({
  daLayerId: v.string(),
})
export type DaPastDayUsageParams = v.infer<typeof DaPastDayUsageParams>

export interface DaPastDayUsage {
  /** Bytes anyone posted to the DA layer over the range, tracked project or not */
  used: number
  /** Bytes the DA layer has room for over the range. Undefined when it has no cap */
  capacity: number | undefined
}

type PostedRecord = Pick<
  DataAvailabilityRecord,
  'projectId' | 'timestamp' | 'totalSize'
>

export async function getDaPastDayUsage({
  daLayerId,
}: DaPastDayUsageParams): Promise<DaPastDayUsage> {
  // the last full UTC day, [from, to)
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const range: [number, number] = [to - UnixTime.DAY, to]

  const daLayer = await ps.getProject({
    id: ProjectId(daLayerId),
    select: ['daLayer'],
  })
  const capacity = getCapacity(
    daLayerId,
    daLayer?.daLayer.throughput ?? [],
    range,
  )

  if (env.MOCK) {
    return { used: Math.round((capacity ?? 1e9) * 0.8), capacity }
  }

  const records = await getDb().dataAvailability.getByDaLayersAndTimeRange(
    [daLayerId],
    range,
  )
  return { used: sumUsed(records, daLayerId, range), capacity }
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
  const inForce = throughput
    .filter((t) => t.sinceTimestamp <= from)
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)
  if (!inForce) return undefined

  const size = daLayerId === ProjectId.ETHEREUM ? inForce.target : inForce.size
  if (size === undefined || size === 'NO_CAP') return undefined

  return (size / inForce.frequency) * (to - from)
}

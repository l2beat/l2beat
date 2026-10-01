import type { DaLayerThroughput, ProjectLivenessConfig } from '@l2beat/config'
import type {
  AggregatedLivenessRecord,
  DataAvailabilityRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export const DaFlowsParams = v.object({
  daLayerId: v.string(),
})
export type DaFlowsParams = v.infer<typeof DaFlowsParams>

export interface DaFlowsData {
  /** Bytes each project posted to the DA layer over the range */
  posted: Record<string, number>
  /**
   * Average seconds between a project's batch submissions over the range.
   * Left out for projects whose batches liveness does not follow
   */
  batchIntervals: Record<string, number>
  /** Bytes anyone posted to the DA layer over the range, tracked project or not */
  used: number
  usedSevenDaysAgo: number
  /** Bytes the DA layer has room for over the range. Undefined when it has no cap */
  capacity: number | undefined
  /** Last full UTC day, [from, to) */
  range: [number, number]
}

type PostedRecord = Pick<
  DataAvailabilityRecord,
  'projectId' | 'timestamp' | 'totalSize'
>

type LivenessAggregate = Pick<
  AggregatedLivenessRecord,
  'projectId' | 'subtype' | 'avg'
>

interface LivenessProject {
  id: string
  livenessConfig: ProjectLivenessConfig
}

export async function getDaFlows({
  daLayerId,
}: DaFlowsParams): Promise<DaFlowsData> {
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const range: [number, number] = [to - UnixTime.DAY, to]
  const sevenDaysAgo: [number, number] = [
    range[0] - 7 * UnixTime.DAY,
    range[1] - 7 * UnixTime.DAY,
  ]

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
    return getMockDaFlows(daLayerId, capacity, range)
  }

  const db = getDb()
  // Liveness follows transactions sent to Ethereum, so it tells how often a
  // project posts only when Ethereum is where it posts
  const hasLiveness = daLayerId === ProjectId.ETHEREUM
  const [records, aggregates, livenessProjects] = await Promise.all([
    db.dataAvailability.getByDaLayersAndTimeRange(
      [daLayerId],
      [sevenDaysAgo[0], range[1]],
    ),
    hasLiveness
      ? // kept by the hour, and the repository takes the last one inclusive
        db.aggregatedLiveness.getAggregatesByTimeRange([
          range[0],
          range[1] - UnixTime.HOUR,
        ])
      : [],
    hasLiveness ? ps.getProjects({ select: ['livenessConfig'] }) : [],
  ])
  return {
    posted: sumPostedByProject(records, daLayerId, range),
    batchIntervals: getBatchIntervals(aggregates, livenessProjects),
    used: sumUsed(records, daLayerId, range),
    usedSevenDaysAgo: sumUsed(records, daLayerId, sevenDaysAgo),
    capacity,
    range,
  }
}

/**
 * The DA layer's own total is stored under the layer's id next to the
 * projects', so it has to be left out of the per-project sums.
 */
export function sumPostedByProject(
  records: PostedRecord[],
  daLayerId: string,
  range: [number, number],
): Record<string, number> {
  const posted: Record<string, number> = {}
  for (const record of records) {
    if (record.projectId === daLayerId || !isInRange(record, range)) continue
    posted[record.projectId] =
      (posted[record.projectId] ?? 0) + Number(record.totalSize)
  }
  return posted
}

/** Everything posted to the DA layer, which it keeps under its own id */
export function sumUsed(
  records: PostedRecord[],
  daLayerId: string,
  range: [number, number],
): number {
  return records
    .filter((r) => r.projectId === daLayerId && isInRange(r, range))
    .reduce((sum, r) => sum + Number(r.totalSize), 0)
}

/**
 * How often each project submitted a batch. A project can have one kind of
 * transaction stand for another, in which case the one it stands for is read.
 */
export function getBatchIntervals(
  aggregates: LivenessAggregate[],
  projects: LivenessProject[],
): Record<string, number> {
  const standIns = new Map(
    projects
      .filter((p) => p.livenessConfig.duplicateData.to === 'batchSubmissions')
      .map((p) => [p.id, p.livenessConfig.duplicateData.from]),
  )

  const intervals: Record<string, number> = {}
  for (const aggregate of aggregates) {
    const subtype = standIns.get(aggregate.projectId) ?? 'batchSubmissions'
    if (aggregate.subtype !== subtype || !(aggregate.avg > 0)) continue
    intervals[aggregate.projectId] = aggregate.avg
  }
  return intervals
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

function isInRange(record: PostedRecord, [from, to]: [number, number]) {
  return record.timestamp >= from && record.timestamp < to
}

const MOCK_BLOB_SIZE = 128 * 1024

async function getMockDaFlows(
  daLayerId: string,
  capacity: number | undefined,
  range: [number, number],
): Promise<DaFlowsData> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['archivedAt'],
  })
  const posting = projects.filter((p) =>
    p.daTrackingConfig.some((c) => c.daLayer === daLayerId),
  )
  // Ethereum counts every blob whole, so there a poster posts whole blobs
  const toPosted =
    daLayerId === ProjectId.ETHEREUM
      ? (bytes: number) =>
          Math.max(1, Math.round(bytes / MOCK_BLOB_SIZE)) * MOCK_BLOB_SIZE
      : Math.round
  const posted = Object.fromEntries(
    posting.map((p, i) => [p.id, toPosted(1_500_000_000 * 0.7 ** i)]),
  )
  const used = Object.values(posted).reduce((sum, value) => sum + value, 0)
  return {
    posted,
    // the larger the poster, the more often it posts, and everyone who
    // posted did so within the day. The last one is left without, as
    // projects that liveness does not follow are
    batchIntervals: Object.fromEntries(
      posting
        .slice(0, -1)
        .map((p, i) => [
          p.id,
          Math.min(Math.round(45 * 1.6 ** i), UnixTime.DAY),
        ]),
    ),
    used,
    usedSevenDaysAgo: Math.round(used * 0.9),
    capacity,
    range,
  }
}

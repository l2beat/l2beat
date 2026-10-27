import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ps } from '~/server/projects'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'

export const ZkCatalogTvsChartParams = v.object({
  range: ChartRange,
})

export type ZkCatalogTvsChartParams = v.infer<typeof ZkCatalogTvsChartParams>

export interface ZkCatalogTvsChartData {
  /** TVS of every prover's projects, keyed by prover id */
  chart: [timestamp: number, valuesByProver: Record<string, number | null>][]
  syncedUntil: number | undefined
}

interface ProjectRange {
  projectId: ProjectId
  sinceTimestamp: number
  untilTimestamp: number | undefined
}

export async function getZkCatalogTvsChart({
  range,
}: ZkCatalogTvsChartParams): Promise<ZkCatalogTvsChartData> {
  const resolution = rangeToResolution(range)
  const rangesByProver = await getProjectRangesByProver(resolution)
  const allRanges = [...rangesByProver.values()].flat()
  const projectIds = [...new Set(allRanges.map((r) => r.projectId))]
  if (projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  if (env.MOCK) {
    return getMockZkCatalogTvsChart(range, [...rangesByProver.keys()])
  }

  const db = getDb()
  const records = await db.tvsTokenValue.getSummedByProjectAtResolution(
    projectIds,
    range,
    resolution,
    // Matches the TVS in the ZK Catalog table
    { excludeRwaRestrictedTokens: true },
  )
  if (records.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  const values = new Map<string, number>()
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY
  for (const record of records) {
    values.set(`${record.projectId}-${record.timestamp}`, record.value)
    minTimestamp = Math.min(minTimestamp, record.timestamp)
    maxTimestamp = Math.max(maxTimestamp, record.timestamp)
  }

  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp: Math.min(...allRanges.map((r) => r.sinceTimestamp)),
    dataStart: minTimestamp,
    resolution,
  })
  const timestamps = generateTimestamps(
    [UnixTime(startTimestamp), UnixTime(maxTimestamp)],
    resolution,
    { addTarget: true },
  )

  const chart = timestamps.map(
    (timestamp): ZkCatalogTvsChartData['chart'][number] => {
      const valuesByProver: Record<string, number | null> = {}
      for (const [proverId, ranges] of rangesByProver) {
        // A project can be listed more than once, e.g. directly and through a
        // DA bridge, but its TVS counts once.
        const liveProjects = new Set(
          ranges
            .filter(
              (r) =>
                r.sinceTimestamp <= timestamp &&
                (r.untilTimestamp === undefined ||
                  r.untilTimestamp >= timestamp),
            )
            .map((r) => r.projectId),
        )
        valuesByProver[proverId] =
          liveProjects.size === 0
            ? null
            : [...liveProjects].reduce(
                (sum, projectId) =>
                  sum + (values.get(`${projectId}-${timestamp}`) ?? 0),
                0,
              )
      }
      return [timestamp, valuesByProver]
    },
  )

  return { chart, syncedUntil: maxTimestamp }
}

async function getProjectRangesByProver(resolution: ChartResolution) {
  const [provers, projects] = await Promise.all([
    ps.getProjects({
      select: ['zkCatalogInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({ optional: ['daBridge'] }),
  ])
  const projectsById = new Map(projects.map((p) => [p.id, p]))

  const rangesByProver = new Map<string, ProjectRange[]>()
  for (const prover of provers) {
    const ranges = (prover.zkCatalogInfo.projectsForTvs ?? []).flatMap(
      (entry) => {
        const project = projectsById.get(entry.projectId)
        if (!project) return []
        // A DA bridge counts the TVS of every project it secures
        const projectIds = project.daBridge
          ? project.daBridge.usedIn.map((p) => p.id)
          : [project.id]
        return projectIds.map((projectId) => ({
          projectId,
          // Floored like on the project page, so the TVS bump lands on the
          // datapoint of the period the project started in
          sinceTimestamp: UnixTime.toStartOf(entry.sinceTimestamp, resolution),
          untilTimestamp: entry.untilTimestamp,
        }))
      },
    )
    if (ranges.length > 0) {
      rangesByProver.set(prover.id, ranges)
    }
  }
  return rangesByProver
}

function getMockZkCatalogTvsChart(
  range: ChartRange,
  proverIds: string[],
): ZkCatalogTvsChartData {
  const resolution = rangeToResolution(range)
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = range[0] ?? to - 365 * UnixTime.DAY
  const chart = generateTimestamps(
    [UnixTime(from), UnixTime(to)],
    resolution,
  ).map((timestamp): ZkCatalogTvsChartData['chart'][number] => [
    timestamp,
    Object.fromEntries(
      proverIds.map((id, i) => [id, (proverIds.length - i) * 1_000_000_000]),
    ),
  ])
  return { chart, syncedUntil: to }
}

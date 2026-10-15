import type { ProjectDefiInfo, TvsToken } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '~/server/features/layer2s/tvs/utils/getTvsTargetTimestamp'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ValuePoint } from './normalizeSeries'

export type OssificationValueSource = 'tvs' | 'defillama'

// Every real project has a series, so mock mode drops one to show the
// no-data state.
const MOCK_PROJECT_WITHOUT_SERIES = 'morph'

export interface OssificationSeries {
  source: OssificationValueSource
  /** Unordered; consumers normalize them, see normalizeSeries */
  points: ValuePoint[]
}

export interface OssificationSeriesProject {
  id: ProjectId
  defiInfo?: ProjectDefiInfo
  tvsConfig?: TvsToken[]
}

export interface OssificationSeriesRequest {
  project: OssificationSeriesProject
  since: UnixTime
}

/**
 * Canonical TVS, or DefiLlama TVL for DeFi projects tracked there, from the
 * last sample at or before `since` (so the value at `since` can be
 * interpolated) to the latest synced one. Null when the project has neither.
 * TVS is read for all requests at once, see readTvsSeries.
 */
export async function getOssificationSeries(
  requests: OssificationSeriesRequest[],
): Promise<(OssificationSeries | null)[]> {
  if (env.MOCK) {
    return requests.map(({ project, since }) => {
      const source = getValueSource(project)
      return !source || project.id === MOCK_PROJECT_WITHOUT_SERIES
        ? null
        : getMockOssificationSeries(source, since)
    })
  }

  const [tvsSeries, defillamaSeries] = await Promise.all([
    readTvsSeries(
      requests.filter(({ project }) => getValueSource(project) === 'tvs'),
    ),
    Promise.all(
      requests
        .filter(({ project }) => getValueSource(project) === 'defillama')
        .map(async ({ project }) => {
          const series = await readDefillamaSeries(project.id)
          return [project.id, series] as const
        }),
    ),
  ])
  const seriesByProject = new Map([...tvsSeries, ...defillamaSeries])
  return requests.map(({ project }) => seriesByProject.get(project.id) ?? null)
}

async function readDefillamaSeries(
  projectId: ProjectId,
): Promise<OssificationSeries> {
  // Daily and at most a few thousand rows, so read whole instead of
  // looking up the sample preceding `since`.
  const rows = await getDb().defiTvl.getByProjectInRange(
    projectId,
    null,
    UnixTime.now(),
  )
  return {
    source: 'defillama',
    points: rows.map((row) => ({
      timestamp: row.timestamp,
      value: row.valueUsd,
    })),
  }
}

/** Two queries for any number of projects, each with its own `since` */
async function readTvsSeries(
  requests: OssificationSeriesRequest[],
): Promise<Map<string, OssificationSeries>> {
  if (requests.length === 0) {
    return new Map()
  }
  const db = getDb()

  // The hour after the target is usually only partially synced.
  const to = getTvsTargetTimestamp()
  // min() keeps a clock younger than the target on its preceding synced value.
  const starts = await db.tvsTokenValue.getMaxTimestampsAtOrBeforeByProject(
    requests.map(({ project, since }) => ({
      projectId: project.id,
      timestamp: Math.min(since, to),
    })),
  )
  const startByProject = new Map(starts.map((s) => [s.projectId, s.timestamp]))
  const rows =
    await db.tvsTokenValue.getSummedByTimestampWithProjectsRangesPerProject(
      requests.map(({ project, since }) => ({
        projectId: project.id,
        sinceTimestamp: startByProject.get(project.id) ?? since,
        untilTimestamp: to,
      })),
      null,
      to,
      {
        forSummary: false,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      },
    )
  const rowsByProject = groupBy(rows, (row) => row.projectId)

  // Canonical only: unlike TVS elsewhere, customCanonical (canonical with
  // additional trust assumptions) is deliberately left out.
  return new Map(
    requests.map(({ project }) => [
      project.id,
      {
        source: 'tvs',
        points: (rowsByProject[project.id] ?? []).map((row) => ({
          timestamp: row.timestamp,
          value: row.canonical,
        })),
      },
    ]),
  )
}

function getValueSource(
  project: OssificationSeriesProject,
): OssificationValueSource | undefined {
  if (project.tvsConfig) {
    return 'tvs'
  }
  if (project.defiInfo?.tvl?.source === 'defillama') {
    return 'defillama'
  }
}

function getMockOssificationSeries(
  source: OssificationValueSource,
  since: UnixTime,
): OssificationSeries {
  let value = (0.1 + Math.random()) * 5_000_000_000
  const points = generateTimestamps([since, UnixTime.now()], 'day').map(
    (timestamp) => {
      value *= 0.97 + Math.random() * 0.06
      return { timestamp, value }
    },
  )
  return { source, points }
}

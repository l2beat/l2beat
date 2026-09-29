import type { ProjectDefiInfo, TvsToken } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '~/server/features/layer2s/tvs/utils/getTvsTargetTimestamp'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ValuePoint } from './normalizeSeries'

export type OssificationValueSource = 'tvs' | 'defillama'

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

/**
 * Canonical TVS, or DefiLlama TVL for DeFi projects tracked there, from the
 * last sample at or before `since` (so the value at `since` can be
 * interpolated) to the latest synced one. Null when the project has neither.
 */
export async function getOssificationSeries(
  project: OssificationSeriesProject,
  since: UnixTime,
): Promise<OssificationSeries | null> {
  const source = getValueSource(project)
  if (!source) {
    return null
  }

  if (env.MOCK) {
    return getMockOssificationSeries(source, since)
  }

  const db = getDb()

  if (source === 'defillama') {
    // Daily and at most a few thousand rows, so read whole instead of
    // looking up the sample preceding `since`.
    const rows = await db.defiTvl.getByProjectInRange(
      project.id,
      null,
      UnixTime.now(),
    )
    return {
      source,
      points: rows.map((row) => ({
        timestamp: row.timestamp,
        value: row.valueUsd,
      })),
    }
  }

  // The hour after the target is usually only partially synced.
  const to = getTvsTargetTimestamp()
  // min() keeps a clock younger than the target on its preceding synced value.
  const start =
    (await db.tvsTokenValue.getMaxTimestampAtOrBeforeForProjects(
      Math.min(since, to),
      [project.id],
    )) ?? since
  const rows = await db.tvsTokenValue.getSummedByTimestampByProjects(
    [project.id],
    start,
    to,
    {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    },
  )
  return {
    source,
    points: rows.map((row) => ({
      timestamp: row.timestamp,
      value: row.canonical,
    })),
  }
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

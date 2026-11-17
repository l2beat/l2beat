import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { optionToRange } from '~/utils/range/range'

export interface LatestTotalValueLocked {
  valueUsd: number
  timestamp: number
}

/** The latest TVL of each project with a TVL source, in USD. */
export async function getTotalValueLockedByProject(
  projects: Pick<Project<'defiInfo'>, 'id' | 'defiInfo'>[],
): Promise<Map<string, number>> {
  const latest = await getLatestTotalValueLocked(projects)
  return new Map(
    [...latest].map(([projectId, { valueUsd }]) => [projectId, valueUsd]),
  )
}

/** The latest TVL of each project with a TVL source, with its time. */
export async function getLatestTotalValueLocked(
  projects: Pick<Project<'defiInfo'>, 'id' | 'defiInfo'>[],
): Promise<Map<string, LatestTotalValueLocked>> {
  const l2beatIds = projects
    .filter((project) => project.defiInfo.tvl?.source === 'l2beat')
    .map((project) => project.id)
  const externalIds = projects
    .filter((project) => project.defiInfo.tvl?.source === 'defillama')
    .map((project) => project.id)
  const externalChainCountByProject = new Map<string, number>(
    projects.flatMap((project) => {
      const tvl = project.defiInfo.tvl
      return tvl?.source === 'defillama'
        ? [[project.id, tvl.chains.length] as const]
        : []
    }),
  )
  const trackedIds = [...l2beatIds, ...externalIds]

  if (trackedIds.length === 0) {
    return new Map()
  }

  if (env.MOCK) {
    const timestamp = UnixTime.toStartOf(UnixTime.now(), 'hour')
    return new Map(
      trackedIds.map((projectId) => [
        projectId,
        { valueUsd: Math.random() * 1_000_000_000 + 1, timestamp },
      ]),
    )
  }

  const [l2beatValues, externalValues] = await Promise.all([
    getDb().tvsTokenValue.getSummedByProjectForRanges(
      l2beatIds,
      [optionToRange('3d')],
      {
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: false,
      },
    ),
    getDb().defiTvl.getLatestByProjects(externalIds),
  ])

  const tvlByProject = new Map<string, LatestTotalValueLocked>()
  // Oldest first, so each project ends on its latest value
  for (const row of l2beatValues) {
    tvlByProject.set(row.project, {
      valueUsd: row.value,
      timestamp: row.timestamp,
    })
  }
  const freshnessCutoff = UnixTime.now() - 3 * UnixTime.DAY
  for (const row of externalValues) {
    if (
      row.timestamp >= freshnessCutoff &&
      row.chainCount === externalChainCountByProject.get(row.projectId)
    ) {
      tvlByProject.set(row.projectId, {
        valueUsd: row.valueUsd,
        timestamp: row.timestamp,
      })
    }
  }
  return tvlByProject
}

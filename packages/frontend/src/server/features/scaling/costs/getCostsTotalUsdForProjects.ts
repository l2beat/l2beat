import type { Project } from '@l2beat/config'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'

/**
 * @returns total onchain costs in USD per project id over the given range.
 * Projects without any costs records are absent from the result.
 */
export async function getCostsTotalUsdForProjects(
  projects: Pick<Project, 'id'>[],
  range: ChartRange,
): Promise<Record<string, number>> {
  if (env.MOCK) {
    return Object.fromEntries(
      projects.map((project, index) => [project.id, 1000 * (index + 1)]),
    )
  }

  const db = getDb()
  const records = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    projects.map((p) => p.id),
    range,
  )

  const totals: Record<string, number> = {}
  for (const record of records) {
    totals[record.projectId] =
      (totals[record.projectId] ?? 0) + record.totalGasUsd
  }
  return totals
}

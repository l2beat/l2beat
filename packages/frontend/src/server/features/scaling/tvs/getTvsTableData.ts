import type { WarningWithSentiment } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import {
  createTvsBreakdownProjectFilter,
  get7dTvsBreakdown,
  type ProjectSevenDayTvsBreakdown,
  type TvsBreakdownProjectFilter,
} from './get7dTvsBreakdown'
import { getAssociatedTokenWarning } from './utils/getAssociatedTokenWarning'
import { getTvsProjects } from './utils/getTvsProjects'

export type TvsTableData = Record<string, TvsTableProjectData>

interface TvsTableProjectData extends ProjectSevenDayTvsBreakdown {
  associatedTokenWarning: WarningWithSentiment | undefined
}

export async function getTvsTableData(
  params: TvsBreakdownProjectFilter,
): Promise<TvsTableData> {
  const tvsProjects = await getTvsProjects(
    createTvsBreakdownProjectFilter(params),
  )
  const { projects } = await get7dTvsBreakdown(params)

  const result: TvsTableData = {}
  for (const [projectId, values] of Object.entries(projects)) {
    const project = tvsProjects.find((p) => p.projectId === projectId)
    assert(project, `project ${projectId} is undefined`)
    const associatedTokenWarning =
      values.breakdown.total > 0 && !params.excludeAssociatedTokens
        ? getAssociatedTokenWarning({
            associatedRatio:
              values.breakdown.associated / values.breakdown.total,
            name: project.details.name,
            associatedTokens: project.details.tvsInfo?.associatedTokens ?? [],
          })
        : undefined

    result[projectId] = {
      ...values,
      associatedTokenWarning,
    }
  }

  return result
}

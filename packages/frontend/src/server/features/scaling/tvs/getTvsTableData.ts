import type { WarningWithSentiment } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
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
  warnings: WarningWithSentiment[]
}

export async function getTvsTableData(
  params: TvsBreakdownProjectFilter,
): Promise<{ total: number; projects: TvsTableData }> {
  const tvsProjects = await getTvsProjects(
    createTvsBreakdownProjectFilter(params),
  )
  const { total, projects } = await get7dTvsBreakdown(params)

  const result: TvsTableData = {}
  for (const [projectId, values] of Object.entries(projects)) {
    const project = tvsProjects.find((p) => p.projectId === projectId)
    assert(project, `project ${projectId} is undefined`)
    const associatedTokenWarning =
      !params.excludeAssociatedTokens && values.breakdown.total > 0
        ? getAssociatedTokenWarning({
            associatedRatio:
              values.breakdown.associated / values.breakdown.total,
            name: project.details.name,
            associatedTokens: project.details.tvsInfo?.associatedTokens ?? [],
          })
        : undefined

    result[projectId] = {
      ...values,
      warnings: compact([
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    }
  }

  return { total, projects: result }
}

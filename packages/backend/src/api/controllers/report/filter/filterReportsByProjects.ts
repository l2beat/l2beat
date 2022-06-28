import { ProjectInfo } from '../../../../model/ProjectInfo'
import { ReportRecord } from '../../../../peripherals/database/ReportRepository'

export function filterReportsByProjects(
  reports: ReportRecord[],
  projects: ProjectInfo[],
): ReportRecord[] {
  const projectAssetMap = getProjectAssetMap(projects)
  return reports.filter(({ projectId, asset }) => {
    if (!projects.some((project) => project.projectId === projectId)) {
      return false
    }
    const assetIds = projectAssetMap.get(projectId)
    if (!assetIds || !assetIds.some((id) => id === asset)) {
      return false
    }
    return true
  })
}

function getProjectAssetMap(projects: ProjectInfo[]) {
  return new Map(
    projects.map((p) => [
      p.projectId,
      p.bridges.flatMap((b) => b.tokens.map((t) => t.id)),
    ]),
  )
}

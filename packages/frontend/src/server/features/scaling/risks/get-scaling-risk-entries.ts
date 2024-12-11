import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export type ScalingRiskEntries = Awaited<
  ReturnType<typeof getScalingRiskEntries>
>
export async function getScalingRiskEntries() {
  const [tvl, projectsChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  const includedProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !p.isArchived,
  )

  const entries = includedProjects
    .map((project) =>
      getScalingRiskEntry(
        project,
        !!projectsVerificationStatuses[project.id.toString()],
        projectsChangeReport,
        tvl,
      ),
    )
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export type ScalingRiskEntry = ReturnType<typeof getScalingRiskEntry>
function getScalingRiskEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  tvl: ProjectsLatestTvlUsd,
) {
  const riskView =
    project.type === 'layer3' ? project.stackedRiskView : project.riskView
  return {
    entryType: 'risk' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: undefined,
    }),
    risks: riskView,
    tvlOrder: tvl[project.id] ?? 0,
  }
}

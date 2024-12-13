import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCurrentEntry } from '../../utils/get-current-entry'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingDaEntries() {
  const activeProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const entries = activeProjects
    .map((p) => {
      const isVerified = getProjectsVerificationStatuses(p)
      return getScalingDataAvailabilityEntry(
        p,
        projectsChangeReport,
        isVerified,
        tvl[p.id],
      )
    })
    .filter(notUndefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

function getScalingDataAvailabilityEntry(
  project: Layer2 | Layer3,
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
  tvl: number | undefined,
) {
  const dataAvailability = getCurrentEntry(project.dataAvailability)
  if (!dataAvailability) return

  return {
    entryType: 'data-availability' as const,
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
    category: project.display.category,
    dataAvailability: {
      layer: dataAvailability.layer,
      bridge: dataAvailability.bridge,
      mode: dataAvailability.mode,
    },
    provider: project.display.provider,
    tvlOrder: tvl ?? 0,
  }
}

export type ScalingDataAvailabilityEntry = Exclude<
  ReturnType<typeof getScalingDataAvailabilityEntry>,
  undefined
>

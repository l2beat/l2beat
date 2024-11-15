import { type Layer2, type Layer3 } from '@l2beat/config'
import { resolvedLayer2s, resolvedLayer3s } from '@l2beat/config/projects'
import { notUndefined } from '@l2beat/shared-pure'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCurrentEntry } from '../../utils/get-current-entry'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export async function getScalingDaEntries() {
  const activeProjects = [...resolvedLayer2s, ...resolvedLayer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const [tvl, projectsVerificationStatuses, projectsChangeReport] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
    ])

  const entries = activeProjects
    .map((p) => {
      const isVerified = !!projectsVerificationStatuses[p.id.toString()]
      return getScalingDataAvailabilityEntry(
        p,
        projectsChangeReport,
        isVerified,
      )
    })
    .filter(notUndefined)

  return groupByMainCategories(orderByStageAndTvl(entries, tvl))
}

function getScalingDataAvailabilityEntry(
  project: Layer2 | Layer3,
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
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
    }),
    dataAvailability: {
      layer: dataAvailability.layer,
      bridge: dataAvailability.bridge,
      mode: dataAvailability.mode,
    },
  }
}

export type ScalingDataAvailabilityEntry = Exclude<
  ReturnType<typeof getScalingDataAvailabilityEntry>,
  undefined
>

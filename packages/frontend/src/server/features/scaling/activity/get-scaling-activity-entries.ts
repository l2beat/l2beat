import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { orderByStageAndPastDayUops } from '../utils/order-by-stage-and-past-day-uops'
import {
  type ActivityProjectTableData,
  getActivityTableData,
} from './get-activity-table-data'
import { getActivityProjects } from './utils/get-activity-projects'

type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
  const [projectsVerificationStatuses, projectsChangeReport, activityData] =
    await Promise.all([
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
      getActivityTableData(projects),
    ])

  const ethereumData = activityData[ProjectId.ETHEREUM]
  assert(ethereumData !== undefined, 'Ethereum data not found')
  const ethereumEntry = getEthereumEntry(ethereumData)

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id]
      const data = activityData[project.id]
      if (!data) {
        return undefined
      }
      return getScalingProjectActivityEntry(
        project,
        data,
        isVerified,
        projectsChangeReport,
      )
    })
    .filter(notUndefined)
    .sort((a, b) => b.data.uops.pastDayCount - a.data.uops.pastDayCount)

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    const recategorisedEntries = groupByMainCategories(
      orderByStageAndPastDayUops(entries),
    )
    return {
      type: 'recategorised' as const,
      entries: {
        rollups: [ethereumEntry, ...recategorisedEntries.rollups],
        validiumsAndOptimiums: [
          ethereumEntry,
          ...recategorisedEntries.validiumsAndOptimiums,
        ],
      },
    }
  }

  return {
    entries: [ethereumEntry, ...entries].sort(
      (a, b) => b.data.uops.pastDayCount - a.data.uops.pastDayCount,
    ),
  }
}

export type ScalingActivityEntry = ReturnType<
  typeof getScalingProjectActivityEntry
>
function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
    }),
    entryType: 'activity' as const,
    dataSource: project.display.activityDataSource,
    dataAvailability: {
      layer: project.dataAvailability?.layer,
    },
    data,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
): ScalingActivityEntry {
  return {
    ...getCommonScalingEntry({ project: 'ethereum' }),
    entryType: 'activity' as const,
    dataSource: 'Blockchain RPC' as const,
    dataAvailability: {
      layer: undefined,
    },
    data,
  }
}

import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import {
  type ActivityProjectTableData,
  getActivityTableData,
} from './activity/get-activity-table-data'
import { getActivityProjects } from './activity/utils/get-activity-projects'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { orderByStageAndPastDayUops } from './utils/order-by-stage-and-past-day-uops'

type ActivityProject = Layer2 | Layer3

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
  const [
    projectsVerificationStatuses,
    implementationChangeReport,
    activityData,
  ] = await Promise.all([
    getProjectsVerificationStatuses(),
    getImplementationChangeReport(),
    getActivityTableData(projects),
  ])

  const ethereumData = activityData[ProjectId.ETHEREUM]
  assert(ethereumData !== undefined, 'Ethereum data not found')
  const ethereumEntry = getEthereumEntry(ethereumData)

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id]
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id]
      const data = activityData[project.id]
      if (!data) {
        return undefined
      }
      return getScalingProjectActivityEntry(
        project,
        data,
        isVerified,
        hasImplementationChanged,
      )
    })
    .filter(notUndefined)
    .sort((a, b) => b.data.pastDayUops - a.data.pastDayUops)

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
    entries: [ethereumEntry, ...entries],
  }
}

export type ScalingActivityEntry = ReturnType<
  typeof getScalingProjectActivityEntry
>
function getScalingProjectActivityEntry(
  project: ActivityProject,
  data: ActivityProjectTableData,
  isVerified: boolean,
  hasImplementationChanged: boolean,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    entryType: 'activity' as const,
    dataSource: project.display.activityDataSource,
    data,
  }
}

function getEthereumEntry(data: ActivityProjectTableData) {
  return {
    ...getCommonScalingEntry({ project: 'ethereum' }),
    entryType: 'activity' as const,

    dataSource: 'Blockchain RPC' as const,
    data,
  }
}

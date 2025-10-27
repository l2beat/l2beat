import type { Project } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectIcon } from '../../utils/getProjectIcon'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import type { ActivityProjectTableData } from './getActivityTableData'
import { getActivityTable } from './getActivityTableData'
import { compareActivityEntry } from './utils/compareActivityEntry'
import { getActivitySyncWarning } from './utils/syncStatus'

export async function getScalingActivityEntries() {
  const unfilteredProjects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'activityConfig', 'display'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })
  const projects = unfilteredProjects.filter(
    (p) => !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(p.id.toString()),
  )
  const [projectsChangeReport, activityData] = await Promise.all([
    getProjectsChangeReport(),
    getActivityTable(projects),
  ])

  const ethereumData = activityData[ProjectId.ETHEREUM]
  assert(ethereumData !== undefined, 'Ethereum data not found')

  const entries = projects
    .map((project) =>
      getScalingProjectActivityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        activityData[project.id],
      ),
    )
    .concat([
      getEthereumEntry(ethereumData, 'rollups'),
      getEthereumEntry(ethereumData, 'validiumsAndOptimiums'),
      getEthereumEntry(ethereumData, 'others'),
      getEthereumEntry(ethereumData, 'notReviewed'),
    ])
    .filter((p) => p !== undefined)
    .sort(compareActivityEntry)

  return groupByScalingTabs(entries)
}

export interface ScalingActivityEntry extends CommonScalingEntry {
  data:
    | {
        tps: ActivityData
        uops: ActivityData
        ratio: number
        isSynced: boolean
      }
    | undefined
}

interface ActivityData {
  pastDayCount: {
    value: number
    change: number
  }
  summedCount: {
    value: number
    change: number
  }
  maxCount: {
    value: number
    timestamp: number
  }
}

function getScalingProjectActivityEntry(
  project: Project<'statuses' | 'scalingInfo' | 'display'>,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): ScalingActivityEntry | undefined {
  const syncWarning = getActivitySyncWarning(data?.syncState)

  if (!data) return undefined

  return {
    ...getCommonScalingEntry({ project, changes, syncWarning }),
    data: {
      tps: data.tps,
      uops: data.uops,
      ratio: data.ratio,
      isSynced: !syncWarning,
    },
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
  tab: CommonScalingEntry['tab'],
): ScalingActivityEntry {
  const syncWarning = getActivitySyncWarning(data.syncState)
  return {
    id: ProjectId.ETHEREUM,
    name: 'Ethereum',
    shortName: undefined,
    icon: getProjectIcon('ethereum'),
    isLayer3: false,
    slug: 'ethereum',
    tab,
    filterable: undefined,
    backgroundColor: 'blue',
    data: {
      tps: data.tps,
      uops: data.uops,
      ratio: data.ratio,
      isSynced: !syncWarning,
    },
    statuses: undefined,
  }
}

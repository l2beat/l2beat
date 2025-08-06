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
import { getActivitySyncWarning } from './utils/isActivitySynced'

export async function getScalingActivityEntries() {
  const unfilteredProjects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'hasActivity', 'display'],
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
  change: number
  pastDayCount: number
  summedCount: number
  maxCount: {
    value: number
    timestamp: number
  }
}

function getScalingProjectActivityEntry(
  project: Project<'statuses' | 'scalingInfo' | 'display'>,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): ScalingActivityEntry {
  const syncWarning = data
    ? getActivitySyncWarning(data.syncedUntil)
    : undefined
  return {
    ...getCommonScalingEntry({ project, changes, syncWarning }),
    data: data
      ? {
          tps: data.tps,
          uops: data.uops,
          ratio: data.ratio,
          isSynced: !syncWarning,
        }
      : undefined,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
  tab: CommonScalingEntry['tab'],
): ScalingActivityEntry {
  const syncWarning = data
    ? getActivitySyncWarning(data.syncedUntil)
    : undefined
  return {
    id: ProjectId.ETHEREUM,
    name: 'Ethereum',
    shortName: undefined,
    icon: getProjectIcon('ethereum'),
    slug: 'ethereum',
    tab,
    // Ethereum is always at the top so it is always stageOrder 3
    stageOrder: 3,
    filterable: undefined,
    data: {
      tps: data.tps,
      uops: data.uops,
      ratio: data.ratio,
      isSynced: !syncWarning,
    },
    statuses: undefined,
  }
}

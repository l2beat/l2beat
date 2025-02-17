import type { Project } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import type { ActivityProjectTableData } from './get-activity-table-data'
import { getActivityTable } from './get-activity-table-data'
import { compareActivityEntry } from './utils/compare-activity-entry'
import { getActivitySyncWarning } from './utils/is-activity-synced'

export async function getScalingActivityEntries() {
  const unfilteredProjects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'hasActivity', 'display'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
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
      getEthereumEntry(ethereumData, 'Rollups'),
      getEthereumEntry(ethereumData, 'ValidiumsAndOptimiums'),
      getEthereumEntry(ethereumData, 'Others'),
    ])
    .sort(compareActivityEntry)

  return groupByTabs(entries)
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
    href: `/scaling/projects/${project.slug}#activity`,
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
  const notSyncedStatus = data
    ? getActivitySyncWarning(data.syncedUntil)
    : undefined
  return {
    id: ProjectId.ETHEREUM,
    name: 'Ethereum',
    shortName: undefined,
    slug: 'ethereum',
    href: undefined,
    tab,
    // Ethereum is always at the top so it is always stageOrder 3
    stageOrder: 3,
    filterable: undefined,
    data: {
      tps: data.tps,
      uops: data.uops,
      ratio: data.ratio,
      isSynced: !notSyncedStatus,
    },
    statuses: undefined,
  }
}

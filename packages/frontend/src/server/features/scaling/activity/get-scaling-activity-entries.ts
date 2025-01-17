import {
  type Project,
  ProjectService,
  type ScalingProjectDisplay,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import {
  type ActivityProjectTableData,
  getActivityTable,
} from './get-activity-table-data'
import { compareActivityEntry } from './utils/compare-activity-entry'
import { getActivityNotSyncedStatus } from './utils/get-activity-not-synced-status'

export async function getScalingActivityEntries() {
  const unfilteredProjects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'activityInfo'],
    optional: ['countdowns'],
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
  dataSource: ScalingProjectDisplay['activityDataSource']
  data:
    | (Omit<ActivityProjectTableData, 'syncedUntil'> & { isSynced: boolean })
    | undefined
}

function getScalingProjectActivityEntry(
  project: Project<'statuses' | 'scalingInfo' | 'activityInfo', 'countdowns'>,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): ScalingActivityEntry {
  const notSyncedStatus = data
    ? getActivityNotSyncedStatus(data.syncedUntil)
    : undefined
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      notSyncedStatuses: [notSyncedStatus],
    }),
    href: `/scaling/projects/${project.slug}#activity`,
    dataSource: project.activityInfo.dataSource,
    data: data
      ? {
          tps: data.tps,
          uops: data.uops,
          ratio: data.ratio,
          isSynced: !notSyncedStatus,
        }
      : undefined,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
  tab: CommonScalingEntry['tab'],
): ScalingActivityEntry {
  const notSyncedStatus = data
    ? getActivityNotSyncedStatus(data.syncedUntil)
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
    dataSource: 'Blockchain RPC',
    data: {
      tps: data.tps,
      uops: data.uops,
      ratio: data.ratio,
      isSynced: !notSyncedStatus,
    },
    statuses: undefined,
  }
}

import {
  ProjectService,
  ProjectWith,
  type ScalingProjectDisplay,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { env } from 'process'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry2,
} from '../get-common-scaling-entry'
import {
  type ActivityProjectTableData,
  getActivityTable,
} from './get-activity-table-data'
import { compareActivityEntry } from './utils/compare-activity-entry'

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
    .concat(
      compact([
        getEthereumEntry(ethereumData, 'Rollups'),
        getEthereumEntry(ethereumData, 'ValidiumsAndOptimiums'),
        getEthereumEntry(ethereumData, 'Others'),
      ]),
    )
    .sort(compareActivityEntry)

  return groupByTabs(entries)
}

export interface ScalingActivityEntry extends CommonScalingEntry {
  dataSource: ScalingProjectDisplay['activityDataSource']
  data: ActivityProjectTableData | undefined
}

function getScalingProjectActivityEntry(
  project: ProjectWith<
    'statuses' | 'scalingInfo' | 'activityInfo',
    'countdowns'
  >,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): ScalingActivityEntry {
  return {
    ...getCommonScalingEntry2({
      project,
      changes,
      syncStatus: data?.syncStatus,
    }),
    href: `/scaling/projects/${project.slug}#activity`,
    dataSource: project.activityInfo.dataSource,
    data,
  }
}

function getEthereumEntry(
  data: ActivityProjectTableData,
  tab: CommonScalingEntry['tab'],
): ScalingActivityEntry {
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
    data,
    statuses: undefined,
  }
}

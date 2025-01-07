import {
  type Layer2,
  type Layer3,
  type ScalingProjectDisplay,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { featureFlags } from '~/consts/feature-flags'
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
import { getActivityProjects } from './utils/get-activity-projects'

export async function getScalingActivityEntries() {
  const projects = getActivityProjects()
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
    .filter((entry) => entry !== undefined)
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
  project: Layer2 | Layer3,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): ScalingActivityEntry | undefined {
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncStatus: data?.syncStatus,
    }),
    href: `/scaling/projects/${project.display.slug}#activity`,
    dataSource: project.display.activityDataSource,
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

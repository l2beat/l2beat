import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingStack,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { getCommonLayer2sEntry } from '../getCommonLayer2sEntry'
import type { ActivityProjectTableData } from './getActivityTableData'
import { getActivityTable } from './getActivityTableData'
import { compareActivityEntry } from './utils/compareActivityEntry'
import { getActivitySyncWarning } from './utils/syncStatus'

export async function getLayer2sActivityEntries() {
  const unfilteredProjects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'activityConfig', 'display'],
    optional: ['contracts'],
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
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
      getLayer2sProjectActivityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        activityData[project.id],
      ),
    )
    .concat(getEthereumEntry(ethereumData))
    .filter((p) => p !== undefined)
    .sort(compareActivityEntry)

  return entries
}

export interface Layer2sActivityEntry extends CommonLayer2sEntry {
  type: ProjectScalingCategory | undefined
  stacks: ProjectScalingStack[] | undefined
  data:
    | {
        tps: ActivityData & {
          totalCount?: { value: number; sinceTimestamp: number }
        }
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

function getLayer2sProjectActivityEntry(
  project: Project<'statuses' | 'scalingInfo' | 'display', 'contracts'>,
  changes: ProjectChanges,
  data: ActivityProjectTableData | undefined,
): Layer2sActivityEntry | undefined {
  const syncWarning = getActivitySyncWarning(data?.syncState)

  if (!data) return undefined

  return {
    ...getCommonLayer2sEntry({ project, changes, syncWarning }),
    type: project.scalingInfo.type,
    stacks: project.scalingInfo.stacks,
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
): Layer2sActivityEntry {
  const syncWarning = getActivitySyncWarning(data.syncState)
  return {
    id: ProjectId.ETHEREUM,
    name: 'Ethereum',
    shortName: undefined,
    icon: manifest.getUrl('/icons/ethereum.png'),
    isLayer3: false,
    slug: 'ethereum',
    tab: 'rollups',
    stacks: undefined,
    type: undefined,
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

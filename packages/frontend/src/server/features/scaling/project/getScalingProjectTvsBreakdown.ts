import type { Project } from '@l2beat/config'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getProjectIcon } from '../../utils/getProjectIcon'
import {
  getProjectTokensEntries as getProjectTokensEntries,
  type TvsBreakdownTokenEntry,
} from '../tvs/breakdown/getProjectTokensEntries'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { getTvsTargetTimestamp } from '../tvs/utils/getTvsTargetTimestamp'

export interface ScalingProjectTvsBreakdown {
  project: Project<
    'tvsConfig' | 'tvsInfo',
    'chainConfig' | 'milestones' | 'contracts' | 'archivedAt'
  >
  icon: string
  dataTimestamp: number
  entries: TvsBreakdownTokenEntry[]
  project7dData: ProjectSevenDayTvsBreakdown
}

export async function getScalingProjectTvsBreakdown(
  slug: string,
): Promise<ScalingProjectTvsBreakdown | undefined> {
  const project = await ps.getProject({
    slug,
    select: ['tvsConfig', 'tvsInfo'],
    optional: ['chainConfig', 'milestones', 'contracts', 'archivedAt'],
    where: ['isScaling'],
  })

  if (!project || env.EXCLUDED_TVS_PROJECTS?.includes(project.id.toString())) {
    return undefined
  }

  const [projects7dData, entries] = await Promise.all([
    get7dTvsBreakdown({
      type: 'projects',
      projectIds: [project.id.toString()],
    }),
    getProjectTokensEntries(project),
  ])

  const project7dData = projects7dData.projects[project.id.toString()]
  if (!project7dData) {
    return undefined
  }

  return {
    project,
    icon: getProjectIcon(project.slug),
    dataTimestamp: getTvsTargetTimestamp(),
    entries,
    project7dData,
  }
}

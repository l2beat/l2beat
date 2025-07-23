import type { Project } from '@l2beat/config'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getProjectIcon } from '../../utils/getProjectIcon'
import { getTvsBreakdownForProject } from '../tvs/breakdown/getTvsBreakdownForProject'
import type { BreakdownRecord } from '../tvs/breakdown/types'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import type { ProjectTokens } from '../tvs/tokens/getTokensForProject'
import { getTokensForProject } from '../tvs/tokens/getTokensForProject'

export interface ScalingProjectTvsBreakdown {
  project: Project<
    'tvsConfig' | 'tvsInfo',
    'chainConfig' | 'milestones' | 'contracts' | 'archivedAt'
  >
  icon: string
  dataTimestamp: number
  breakdown: BreakdownRecord
  project7dData: ProjectSevenDayTvsBreakdown
  projectTokens: ProjectTokens | undefined
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

  const [projects7dData, { dataTimestamp, breakdown }, projectTokens] =
    await Promise.all([
      get7dTvsBreakdown({
        type: 'projects',
        projectIds: [project.id.toString()],
      }),
      getTvsBreakdownForProject(project),
      getTokensForProject(project),
    ])

  const project7dData = projects7dData.projects[project.id.toString()]
  if (!project7dData) {
    return undefined
  }

  return {
    project,
    icon: getProjectIcon(project.slug),
    dataTimestamp,
    breakdown,
    project7dData,
    projectTokens,
  }
}

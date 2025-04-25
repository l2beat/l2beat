import type { Project } from '@l2beat/config'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getProjectIcon } from '../../utils/get-project-icon'
import { getTvsBreakdownForProject } from '../tvs/breakdown/get-tvs-breakdown-for-project'
import type { BreakdownRecord } from '../tvs/breakdown/types'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get-7d-tvs-breakdown'
import { get7dTvsBreakdown } from '../tvs/get-7d-tvs-breakdown'
import type { ProjectTokens } from '../tvs/tokens/get-tokens-for-project'
import { getTokensForProject } from '../tvs/tokens/get-tokens-for-project'

export interface ScalingProjectTvsBreakdownData {
  project: Project<
    'tvsConfig' | 'tvlInfo',
    'chainConfig' | 'milestones' | 'contracts'
  >
  icon: string
  dataTimestamp: number
  breakdown: BreakdownRecord
  project7dData: ProjectSevenDayTvsBreakdown
  projectTokens: ProjectTokens | undefined
}

export async function getScalingProjectTvsBreakdownData(
  slug: string,
): Promise<ScalingProjectTvsBreakdownData | undefined> {
  const project = await ps.getProject({
    slug,
    select: ['tvsConfig', 'tvlInfo'],
    optional: ['chainConfig', 'milestones', 'contracts'],
    where: ['isScaling'],
  })

  if (!project || env.EXCLUDED_TVS_PROJECTS?.includes(project.id.toString())) {
    return undefined
  }

  const projects7dData = await get7dTvsBreakdown({ type: 'layer2' })
  const project7dData = projects7dData.projects[project.id.toString()]
  if (!project7dData) {
    return undefined
  }

  const [{ dataTimestamp, breakdown }, projectTokens] = await Promise.all([
    getTvsBreakdownForProject(project),
    getTokensForProject(project),
  ])

  return {
    project,
    icon: getProjectIcon(project.slug),
    dataTimestamp,
    breakdown,
    project7dData,
    projectTokens,
  }
}

import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { get7dTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'

export async function getDaProjectsTvs(projectIds: ProjectId[]) {
  if (env.MOCK) {
    return getMockDaProjectsTvsData()
  }
  return await getDaProjectsTvsData(projectIds)
}

type DaProjectsTvs = Awaited<ReturnType<typeof getDaProjectsTvsData>>
async function getDaProjectsTvsData(projectIds: ProjectId[]) {
  const breakdown = await get7dTvsBreakdown({ type: 'projects', projectIds })

  const aggregated = Object.entries(breakdown.projects).map(
    ([projectId, projectValues]) => {
      return {
        projectId: ProjectId(projectId),
        tvs: projectValues.breakdown.total,
        tvs7d: projectValues.breakdown7d.total,
      }
    },
  )

  return aggregated
}

/**
 * @helper
 */
export function pickTvsForProjects(
  aggregate: Awaited<ReturnType<typeof getDaProjectsTvsData>>,
) {
  return function (projects: ProjectId[]) {
    const included = aggregate.filter((x) => projects.includes(x.projectId))

    const latest = included.reduce((acc, curr) => acc + curr.tvs, 0)
    const sevenDaysAgo = included.reduce((acc, curr) => acc + curr.tvs7d, 0)

    return { latest, sevenDaysAgo }
  }
}

async function getMockDaProjectsTvsData(): Promise<DaProjectsTvs> {
  const projects = await ps.getProjects({ where: ['isScaling'] })
  return projects.map((project) => ({
    projectId: project.id,
    tvs: 100000,
    tvs7d: 90000,
  }))
}

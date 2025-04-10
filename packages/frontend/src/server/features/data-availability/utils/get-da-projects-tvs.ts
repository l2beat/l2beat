import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getTvsValuesForProjects } from '../../scaling/new-tvs/utils/get-tvs-values-for-projects'

export async function getDaProjectsTvs(projectIds: ProjectId[]) {
  if (env.MOCK) {
    return getMockDaProjectsTvsData()
  }
  return await getDaProjectsTvsData(projectIds)
}

type DaProjectsTvs = Awaited<ReturnType<typeof getDaProjectsTvsData>>
async function getDaProjectsTvsData(projectIds: ProjectId[]) {
  const tvsValues = await getTvsValuesForProjects(
    projectIds.map((id) => ({ projectId: id })),
    '7d',
    'PROJECT',
  )

  const aggregated = Object.entries(tvsValues).map(
    ([projectId, projectValues]) => {
      const values = Object.values(projectValues)

      const latestTvs = values.at(-1)?.value
      const oldestTvs = values.at(0)?.value

      return {
        projectId: ProjectId(projectId),
        tvs: Number(latestTvs),
        tvs7d: Number(oldestTvs),
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

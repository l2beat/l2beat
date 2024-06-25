import { ProjectId } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'

export async function getDaProjectsTvl(projectIds: ProjectId[]) {
  noStore()
  return await getCachedDaProjectsTvl(projectIds)
}

const getCachedDaProjectsTvl = cache(async (projectIds: ProjectId[]) => {
  const values = await db.value.getLatestValuesForProjects(projectIds)

  const byProject = groupBy(values, 'projectId')

  const aggregated = Object.entries(byProject).map(([projectId, values]) => {
    const canonical = values.reduce((acc, value) => acc + value.canonical, 0n)
    const external = values.reduce((acc, value) => acc + value.external, 0n)
    const native = values.reduce((acc, value) => acc + value.native, 0n)

    const sum = canonical + external + native

    return {
      projectId: ProjectId(projectId),
      tvl: sum,
    }
  })

  return aggregated
})

// helper
export function pickTvlForProjects(
  aggregate: Awaited<ReturnType<typeof getCachedDaProjectsTvl>>,
) {
  return function (projects: ProjectId[]) {
    const included = aggregate.filter((x) => projects.includes(x.projectId))

    const sum = included.reduce((acc, curr) => acc + curr.tvl, 0n)

    return sum
  }
}

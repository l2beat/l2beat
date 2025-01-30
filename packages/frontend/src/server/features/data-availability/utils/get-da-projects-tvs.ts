import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectsTvs(projectIds: ProjectId[]) {
  if (env.MOCK) {
    return getMockDaProjectsTvsData()
  }
  return await getDaProjectsTvsData(projectIds)
}

type DaProjectsTvs = Awaited<ReturnType<typeof getDaProjectsTvsData>>
async function getDaProjectsTvsData(projectIds: ProjectId[]) {
  const db = getDb()
  const values = await db.value.getLatestValues(projectIds)

  const byProject = groupBy(values, 'projectId')

  const aggregated = Object.entries(byProject).map(([projectId, values]) => {
    const { canonical, external, native } = values.reduce(
      (acc, value) => {
        acc.canonical += value.canonical
        acc.external += value.external
        acc.native += value.native

        return acc
      },
      { canonical: 0n, external: 0n, native: 0n },
    )

    const tvs = canonical + external + native

    return {
      projectId: ProjectId(projectId),
      tvs: Number(tvs),
    }
  })

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

    const sum = included.reduce((acc, curr) => acc + curr.tvs, 0)

    // Fiat denomination to cents
    return sum / 100
  }
}

function getMockDaProjectsTvsData(): DaProjectsTvs {
  return [...layer2s, ...layer3s].map((project) => ({
    projectId: project.id,
    tvs: 100000,
  }))
}

import type { ValueRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export async function getDaProjectsTvs(projectIds: ProjectId[]) {
  if (env.MOCK) {
    return getMockDaProjectsTvsData()
  }
  return await getDaProjectsTvsData(projectIds)
}

type DaProjectsTvs = Awaited<ReturnType<typeof getDaProjectsTvsData>>
async function getDaProjectsTvsData(projectIds: ProjectId[]) {
  const db = getDb()
  const to = UnixTime.now().toStartOf('hour').add(-1, 'hours')
  const from = to.add(-7, 'days')
  const values = await db.value.getValuesByProjectIdsAndTimeRange(projectIds, [
    from,
    to,
  ])

  const byProject = groupBy(values, 'projectId')

  const aggregated = Object.entries(byProject).map(([projectId, values]) => {
    const timestamps = values.map((v) => v.timestamp.toNumber())
    const latestTimestamp = Math.max(...timestamps)
    const oldestTimestamp = Math.min(...timestamps)

    const latestValues = values.filter(
      (v) => v.timestamp.toNumber() === latestTimestamp,
    )
    const oldestValues = values.filter(
      (v) => v.timestamp.toNumber() === oldestTimestamp,
    )

    const latestTvs = sumTvs(latestValues)
    const oldestTvs = sumTvs(oldestValues)

    return {
      projectId: ProjectId(projectId),
      tvs: Number(latestTvs),
      tvs7d: Number(oldestTvs),
    }
  })

  return aggregated
}

function sumTvs(values: ValueRecord[]) {
  return values.reduce(
    (acc, value) =>
      acc +
      Number(value.canonical) +
      Number(value.external) +
      Number(value.native),
    0,
  )
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
    const sum7d = included.reduce((acc, curr) => acc + curr.tvs7d, 0)

    // Fiat denomination to cents
    return { latest: sum / 100, sevenDaysAgo: sum7d / 100 }
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

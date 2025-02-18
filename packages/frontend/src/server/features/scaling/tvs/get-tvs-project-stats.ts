import type { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getTokenBreakdown } from './utils/get-token-breakdown'
import { getTvsBreakdown } from './utils/get-tvs-breakdown'
import { toTvsProject } from './utils/get-tvs-projects'
import { getTvsValuesForProjects } from './utils/get-tvs-values-for-projects'

export async function getTvsProjectStats(project: Layer2 | Layer3 | Bridge) {
  if (env.MOCK) {
    return getMockTvsProjectStatsData()
  }
  return getTvsProjectStatsData(project)
}

type TvsProjectStats = Awaited<ReturnType<typeof getTvsProjectStatsData>>
async function getTvsProjectStatsData(project: Layer2 | Layer3 | Bridge) {
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const tvsProject = toTvsProject(project, chains)
  const tvsValues = await getTvsValuesForProjects([tvsProject], '7d')
  const projectTvsValues = tvsValues[project.id]
  if (!projectTvsValues) {
    return
  }

  const latestTimestamp = Math.max(...Object.keys(projectTvsValues).map(Number))
  const oldestTimestamp = Math.min(...Object.keys(projectTvsValues).map(Number))

  const latestValues = projectTvsValues[latestTimestamp] ?? []
  const breakdown = getTokenBreakdown(latestValues)
  const tvsBreakdown = getTvsBreakdown(latestValues)
  const oldTvsBreakdown = getTvsBreakdown(
    projectTvsValues[oldestTimestamp] ?? [],
  )

  const total =
    tvsBreakdown.native + tvsBreakdown.canonical + tvsBreakdown.external
  const oldTotal =
    oldTvsBreakdown.native +
    oldTvsBreakdown.canonical +
    oldTvsBreakdown.external

  const totalChange = oldTotal !== 0 ? (total - oldTotal) / oldTotal : 0

  return {
    tokenBreakdown: {
      total: breakdown.total / 100,
      ether: breakdown.ether / 100,
      stablecoin: breakdown.stablecoin / 100,
      associated: breakdown.associated / 100,
    },
    tvsBreakdown: {
      total: total / 100,
      native: tvsBreakdown.native / 100,
      canonical: tvsBreakdown.canonical / 100,
      external: tvsBreakdown.external / 100,
      totalChange,
    },
  }
}

function getMockTvsProjectStatsData(): TvsProjectStats {
  return {
    tokenBreakdown: {
      total: 100,
      ether: 80,
      stablecoin: 15,
      associated: 5,
    },
    tvsBreakdown: {
      total: 60,
      canonical: 30,
      native: 20,
      external: 10,
      totalChange: 0.25,
    },
  }
}

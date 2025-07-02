import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { ActivityLeaderboard } from '~/server/features/monthly-reports/getActivityLeaderboard'
import type { TvsLeaderboard } from '~/server/features/monthly-reports/getTvsLeaderboard'
import type { EcosystemMonthlyUpdateEntry } from '../getEcosystemEntries'

export function getEcosystemTvsLeaderboard(
  ecosystemProjects: Project<'ecosystemInfo'>[],
  leaderboard: TvsLeaderboard,
): EcosystemMonthlyUpdateEntry['tvsLeaderboard'] {
  const ecosystemLeaderboardData = Object.entries(leaderboard.projects).filter(
    ([id]) => ecosystemProjects.some((p) => p.id === id),
  )

  const gainers = ecosystemLeaderboardData
    .sort((a, b) => b[1].change - a[1].change)
    .slice(0, 3)
  const leaders = ecosystemLeaderboardData
    .sort((a, b) => b[1].tvs - a[1].tvs)
    .slice(0, 3)

  return {
    gainers: gainers.map(([id, data]) => {
      const project = ecosystemProjects.find((p) => p.id === id)
      assert(project, `Project not found for ${id}`)
      return {
        slug: project.slug,
        name: project.name,
        tvs: data.tvs,
        change: data.change,
      }
    }),
    leaders: leaders.map(([id, data]) => {
      const project = ecosystemProjects.find((p) => p.id === id)
      assert(project, `Project not found for ${id}`)
      return {
        slug: project.slug,
        name: project.name,
        tvs: data.tvs,
        change: data.change,
      }
    }),
  }
}

export function getEcosystemActivityLeaderboard(
  ecosystemProjects: Project<'ecosystemInfo'>[],
  leaderboard: ActivityLeaderboard,
): EcosystemMonthlyUpdateEntry['activityLeaderboard'] {
  const ecosystemLeaderboardData = Object.entries(leaderboard.projects).filter(
    ([id]) => ecosystemProjects.some((p) => p.id === id),
  )

  const gainers = ecosystemLeaderboardData
    .sort((a, b) => b[1].change - a[1].change)
    .slice(0, 3)
  const leaders = ecosystemLeaderboardData
    .sort((a, b) => b[1].uops - a[1].uops)
    .slice(0, 3)

  return {
    gainers: gainers.map(([id, data]) => {
      const project = ecosystemProjects.find((p) => p.id === id)
      assert(project, `Project not found for ${id}`)
      return {
        slug: project.slug,
        name: project.name,
        uops: data.uops,
        change: data.change,
      }
    }),
    leaders: leaders.map(([id, data]) => {
      const project = ecosystemProjects.find((p) => p.id === id)
      assert(project, `Project not found for ${id}`)
      return {
        slug: project.slug,
        name: project.name,
        uops: data.uops,
        change: data.change,
      }
    }),
  }
}

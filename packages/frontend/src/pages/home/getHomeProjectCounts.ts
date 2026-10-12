import { ps } from '~/server/projects'

export interface HomeProjectCounts {
  l2: number
  privacy: number
}

export async function getHomeProjectCounts(): Promise<HomeProjectCounts> {
  const [l2Projects, privacy] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['privacyInfo'],
    }),
  ])

  return {
    l2: l2Projects.length,
    privacy: privacy.length,
  }
}

import { type Layer2, type Layer3 } from '@l2beat/config'
import { resolvedLayer2s, resolvedLayer3s } from '@l2beat/config/projects'
import { assert } from '@l2beat/shared-pure'
import { getHostChain } from '../utils/get-host-chain'

export function getScalingUpcomingEntries() {
  const projects = [...resolvedLayer2s, ...resolvedLayer3s].filter(
    (p) => p.isUpcoming,
  )

  return projects
    .sort((a, b) => {
      assert(
        a.createdAt && b.createdAt,
        'Project has no createdAt although it is upcoming',
      )
      return b.createdAt.toNumber() - a.createdAt.toNumber()
    })
    .map((project) => getScalingUpcomingEntry(project))
}

export type ScalingUpcomingEntry = ReturnType<typeof getScalingUpcomingEntry>
function getScalingUpcomingEntry(project: Layer2 | Layer3) {
  return {
    id: project.id,
    slug: project.display.slug,
    href: `/scaling/projects/${project.display.slug}`,
    name: project.display.name,
    shortName: project.display.shortName,
    category: project.display.category,
    provider: project.display.provider,
    hostChain: getHostChain(project),
    purposes: project.display.purposes,
  }
}

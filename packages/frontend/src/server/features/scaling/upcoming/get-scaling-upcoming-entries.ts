import { layer2s, layer3s } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { getHostChain } from '../utils/get-host-chain'

export type ScalingUpcomingEntry = ReturnType<
  typeof getScalingUpcomingEntries
>[number]
export function getScalingUpcomingEntries() {
  const projects = [...layer2s, ...layer3s].filter((p) => p.isUpcoming)

  return projects
    .sort((a, b) => {
      assert(
        a.createdAt && b.createdAt,
        'Project has no createdAt although it is upcoming',
      )
      return b.createdAt.toNumber() - a.createdAt.toNumber()
    })
    .map((project) => ({
      id: project.id,
      slug: project.display.slug,
      href: `/scaling/projects/${project.display.slug}`,
      name: project.display.name,
      shortName: project.display.shortName,
      category: project.display.category,
      provider: project.display.provider,
      hostChain: getHostChain(project),
      purposes: project.display.purposes,
    }))
}

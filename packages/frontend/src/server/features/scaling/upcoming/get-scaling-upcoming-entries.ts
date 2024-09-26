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
      console.log(a.display.name, b.display.name)
      console.log(a.createdAt, b.createdAt)
      assert(a.createdAt && b.createdAt, 'Project has no createdAt')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

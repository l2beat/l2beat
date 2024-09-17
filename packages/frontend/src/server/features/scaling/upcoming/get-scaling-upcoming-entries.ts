import { layer2s, layer3s } from '@l2beat/config'

export type ScalingUpcomingEntry = ReturnType<
  typeof getScalingUpcomingEntries
>[number]
export function getScalingUpcomingEntries() {
  const projects = [...layer2s, ...layer3s].filter((p) => p.isUpcoming)

  return projects.map((project) => ({
    id: project.id,
    slug: project.display.slug,
    name: project.display.name,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
  }))
}

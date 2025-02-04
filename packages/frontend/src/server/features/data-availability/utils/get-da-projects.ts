import { layer2s, layer3s } from '@l2beat/config'
import { ps } from '~/server/projects'
import { getDaBridges } from './get-da-bridges'

export async function getUniqueProjectsInUse() {
  const custom = [...layer2s, ...layer3s]
    .filter((project) => project.customDa)
    .map((project) => project.id)

  const projects = await ps.getProjects({
    select: ['daLayer', 'daBridges'],
  })
  return [
    ...new Set(
      projects
        .map((project) =>
          getDaBridges(project).map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
    // These are derived from scaling projects
    ...custom,
  ]
}

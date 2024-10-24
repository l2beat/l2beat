import { type Layer2, type Layer3 } from '@l2beat/config'
import { resolvedLayer2s } from '@l2beat/config/projects'

export function getHostChain(project: Layer2 | Layer3) {
  if (project.type === 'layer2') {
    return undefined
  }
  if (project.hostChain === 'Multiple') {
    return 'Multiple'
  }
  const layer2 = resolvedLayer2s.find((l) => l.id === project.hostChain)
  if (!layer2) {
    throw new Error(
      `Unknown host chain: ${project.hostChain} for project ${project.id}`,
    )
  }
  return layer2.display.name
}

import type { Layer3 } from '@l2beat/config'
import { layer2s } from '@l2beat/config'

export function getHostChain(project: Layer3) {
  const layer2 = layer2s.find((l) => l.id === project.hostChain)
  if (!layer2) {
    throw new Error(
      `Unknown host chain: ${project.hostChain} for project ${project.id}`,
    )
  }
  return layer2.display.name
}

import { type Layer2, type Layer3, layer2s } from '@l2beat/config'

export function getHostChain(project: Layer2 | Layer3) {
  if (project.type === 'layer2') {
    return undefined
  }
  if (project.hostChain === 'Multiple') {
    return 'Multiple'
  }
  const layer2 = layer2s.find((l) => l.id === project.hostChain)
  if (!layer2) {
    throw new Error(
      `Unknown host chain: ${project.hostChain} for project ${project.id}`,
    )
  }
  return layer2.display.name
}

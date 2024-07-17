import { type DaBridge, layer2s, layer3s } from '@l2beat/config'
import assert from 'assert'

export interface UsedInProject {
  name: string
  slug: string
}

export function getUsedInProjects(bridge: DaBridge): UsedInProject[] {
  return bridge.usedIn.map((projectId) => {
    const project = [...layer2s, ...layer3s].find((p) => p.id === projectId)
    assert(project, `Project not found: ${projectId}`)
    return {
      slug: project.display.slug,
      name: project.display.name,
    }
  })
}

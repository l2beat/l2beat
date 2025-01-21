import type { Layer2 } from '../../layer2s'
import type { Layer3 } from '../../layer3s'
import type { UsedInProject } from '../types/UsedInProject'

export function toUsedInProject(projects: (Layer2 | Layer3)[]) {
  return projects.map(toUsedIn)
}

function toUsedIn(project: Layer2 | Layer3): UsedInProject {
  return {
    id: project.id,
    name: project.display.name,
    slug: project.display.slug,
  }
}

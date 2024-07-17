import { Layer2 } from '../../../layer2s'
import { Layer3 } from '../../../layer3s'
import { DaProjectReference } from '../types/DaProjectReference'

export function toDaProjectReference(projects: (Layer2 | Layer3)[]) {
  return projects.map(reference)
}

function reference(project: Layer2 | Layer3): DaProjectReference {
  return {
    id: project.id,
    display: project.display.name,
    slug: project.display.slug,
  }
}

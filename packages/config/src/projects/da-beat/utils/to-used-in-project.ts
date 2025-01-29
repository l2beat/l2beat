import type { Layer2, Layer3, UsedInProject } from '../../../types'

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

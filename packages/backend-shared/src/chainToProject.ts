import { layer2s, layer3s } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

// #region Chain to project mapping

export const chainToProject = new Map<string, ProjectId>()

for (const project of layer2s) {
  if (project.chainConfig) {
    chainToProject.set(project.chainConfig.name, project.id)
  }
}

for (const project of layer3s) {
  if (project.chainConfig) {
    chainToProject.set(project.chainConfig.name, project.id)
  }
}

// #endregion

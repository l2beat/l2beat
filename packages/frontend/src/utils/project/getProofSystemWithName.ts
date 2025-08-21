import type { Project, ProjectScalingProofSystem } from '@l2beat/config'

export function getProofSystemWithName(
  proofSystem: ProjectScalingProofSystem | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
) {
  if (!proofSystem) return undefined

  return {
    ...proofSystem,
    name:
      proofSystem.name ??
      zkCatalogProjects.find((p) => p.id === proofSystem.zkCatalogId)?.name,
  }
}

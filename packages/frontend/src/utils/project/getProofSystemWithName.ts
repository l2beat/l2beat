import type { Project, ProjectScalingProofSystem } from '@l2beat/config'
import { getUsedZkCatalogProjects } from './getUsedZkCatalogProjects'

export function getProofSystemWithName(
  proofSystem: ProjectScalingProofSystem,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ProjectScalingProofSystem
export function getProofSystemWithName(
  proofSystem: ProjectScalingProofSystem | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ProjectScalingProofSystem | undefined
export function getProofSystemWithName(
  proofSystem: ProjectScalingProofSystem | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ProjectScalingProofSystem | undefined {
  if (!proofSystem) return undefined

  const usedZkCatalogProjects = getUsedZkCatalogProjects(
    proofSystem,
    zkCatalogProjects,
  )
  return {
    ...proofSystem,
    name:
      proofSystem.name ??
      (usedZkCatalogProjects.length > 0
        ? usedZkCatalogProjects.map((p) => p.name).join(' / ')
        : undefined),
  }
}

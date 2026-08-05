import type { Project, ProjectScalingProofSystem } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'

export function getUsedZkCatalogProjects(
  proofSystem: ProjectScalingProofSystem | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): Project<'zkCatalogInfo'>[] {
  return (proofSystem?.zkCatalogIds ?? []).map((zkCatalogId) => {
    const zkCatalogProject = zkCatalogProjects.find((p) => p.id === zkCatalogId)
    assert(zkCatalogProject, `zkCatalogProject not found: ${zkCatalogId}`)
    return zkCatalogProject
  })
}

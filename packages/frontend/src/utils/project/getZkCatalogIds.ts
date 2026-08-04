import type { ProjectScalingProofSystem } from '@l2beat/config'

export function getZkCatalogIds(
  proofSystem: ProjectScalingProofSystem | undefined,
): string[] {
  if (!proofSystem) return []
  if (proofSystem.zkCatalogIds) return proofSystem.zkCatalogIds
  return proofSystem.zkCatalogId ? [proofSystem.zkCatalogId] : []
}

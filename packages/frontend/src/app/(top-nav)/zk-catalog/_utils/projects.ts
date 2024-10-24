import {
  resolvedLayer2s,
  resolvedLayer3s,
  resolvedZkCatalogProjects,
} from '@l2beat/config/projects'

export const projects = [
  ...resolvedZkCatalogProjects,
  ...resolvedLayer2s.filter((l2) => l2.stateValidation?.proofVerification),
  ...resolvedLayer3s.filter((l3) => l3.stateValidation?.proofVerification),
]

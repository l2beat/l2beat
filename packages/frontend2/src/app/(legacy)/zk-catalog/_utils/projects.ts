import { layer2s, layer3s, zkCatalogProjects } from '@l2beat/config'

export const projects = [
  ...zkCatalogProjects,
  ...layer2s.filter((l2) => l2.stateValidation?.proofVerification),
  ...layer3s.filter((l3) => l3.stateValidation?.proofVerification),
]

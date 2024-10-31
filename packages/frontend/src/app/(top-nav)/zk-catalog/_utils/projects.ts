import {
  zkCatalogProjects as configZkCatalogProjects,
  layer2s,
  layer3s,
} from '@l2beat/config'

export const zkCatalogProjects = [
  ...configZkCatalogProjects,
  ...layer2s.filter((l2) => l2.stateValidation?.proofVerification),
  ...layer3s.filter((l3) => l3.stateValidation?.proofVerification),
]

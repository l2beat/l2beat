import { ZkCatalogProject } from './types/ZkCatalogProject'
import { worldcoinsemaphore } from './worldcoinsemaphore'
import { worldcoinsmtb } from './worldcoinsmtb'

export * from './types'

export const zkCatalogProjects: ZkCatalogProject[] = [
  worldcoinsemaphore,
  worldcoinsmtb,
]

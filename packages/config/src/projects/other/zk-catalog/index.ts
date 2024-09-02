import { blobstreamSP1 } from './blobstreamSP1'
import { payy } from './payy'
import { risczero } from './risczero'
import { soulwallet } from './soulwallet'
import { ZkCatalogProject } from './types/ZkCatalogProject'
import { worldcoinsemaphore } from './worldcoinsemaphore'
import { worldcoinsmtb } from './worldcoinsmtb'

export * from './types'
export * from './common'
export * from './utils/getVerifiers'

export const zkCatalogProjects: ZkCatalogProject[] = [
  blobstreamSP1,
  payy,
  risczero,
  soulwallet,
  worldcoinsemaphore,
  worldcoinsmtb,
]

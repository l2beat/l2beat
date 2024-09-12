import { SP1Blobstream } from './SP1Blobstream'
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
  SP1Blobstream,
  payy,
  risczero,
  soulwallet,
  worldcoinsemaphore,
  worldcoinsmtb,
]

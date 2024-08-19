import { blobstreamx } from './blobstreamx'
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
  blobstreamx,
  payy,
  risczero,
  soulwallet,
  worldcoinsemaphore,
  worldcoinsmtb,
]

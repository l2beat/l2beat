import type { ZkCatalogProofVerification } from './utils/types'

export interface ZkCatalogViewEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  shortDescription: string | undefined
  trustedSetup: string
}

import type { ZkCatalogProofVerification } from './v1/utils/types'

export interface ZkCatalogViewEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  shortDescription: string | undefined
  trustedSetup: string
}

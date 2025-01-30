import type { ZkCatalogProofVerification } from './_utils/types'

export interface ZkCatalogViewEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  shortDescription: string | undefined
  trustedSetup: string
}

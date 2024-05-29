import { ZkCatalogProofVerification } from '../../utils/zk-catalog/types'

export interface ZkCatalogViewEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  shortDescription: string | undefined
  hasTrustedSetup: boolean
}

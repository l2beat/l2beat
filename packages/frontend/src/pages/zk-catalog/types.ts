import { ZkCatalogProofVerification } from '../../utils/zk-catalog/types'

export interface ZkCatalogViewEntry extends ZkCatalogProofVerification {
  name: string
  shortName: string | undefined
  slug: string
  hasTrustedSetup: boolean
}

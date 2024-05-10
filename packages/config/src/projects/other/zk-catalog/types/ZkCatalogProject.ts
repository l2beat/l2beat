import { ProofVerification } from '../../../types'

export interface ZkCatalogProject {
  type: 'zk-catalog'
  display: {
    slug: string
    name: string
    shortName?: string
  }
  proofVerification: ProofVerification
}

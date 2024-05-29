import { ProofVerification } from '../../../types'

export interface ZkCatalogProject {
  type: 'zk-catalog'
  display: {
    slug: string
    name: string
  }
  proofVerification: ProofVerification
}

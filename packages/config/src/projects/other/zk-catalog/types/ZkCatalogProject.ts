import { ProofVerification } from '../../../types'

export interface ZkCatalogProject {
  display: {
    slug: string
    name: string
    shortName?: string
    link: string
  }
  proofVerification: ProofVerification
}

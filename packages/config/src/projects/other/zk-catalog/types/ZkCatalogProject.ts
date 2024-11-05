import { UnixTime } from '@l2beat/shared-pure'
import { ProofVerification } from '../../../types'

export interface ZkCatalogProject {
  type: 'zk-catalog'
  display: {
    slug: string
    name: string
  }
  createdAt: UnixTime
  proofVerification: ProofVerification
}

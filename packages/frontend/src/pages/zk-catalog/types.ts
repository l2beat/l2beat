import { ProofVerification } from '@l2beat/config'

export interface ZkCatalogViewEntry extends ProofVerification {
  name: string
  shortName: string | undefined
  slug: string
  hasTrustedSetup: boolean
}

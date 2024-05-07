import { EthereumAddress } from '@l2beat/shared-pure'

export interface ProofVerification {
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

interface OnchainVerifier {
  name: string
  description: string
  contractAddress: EthereumAddress
  verified: 'yes' | 'no' | 'failed'
  subVerfiers: SubVerfier[]
}

interface RequiredTool {
  name: string
  description: string
  link?: string
}

interface SubVerfier {
  proofSystem: string
  trustedSetup: string
}

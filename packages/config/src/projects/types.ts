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
  subVerifiers: SubVerifier[]
}

interface RequiredTool {
  name: string
  description: string
  link?: string
}

interface SubVerifier {
  name: string
  proofSystem: string
  mainArithmetization: string
  mainPCS: string
  trustedSetup?: string
  link?: string
}

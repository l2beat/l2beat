import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export interface ProofVerification {
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

interface OnchainVerifier {
  name: string
  description: string
  contractAddress: EthereumAddress
  chainId: ChainId
  verified: 'yes' | 'no' | 'failed'
  subVerifiers: SubVerifier[]
}

interface RequiredTool {
  name: string
  version: `v${string}`
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

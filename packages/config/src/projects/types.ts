import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export interface ProofVerification {
  shortDescription?: string
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

export interface OnchainVerifier {
  name: string
  description: string
  contractAddress: EthereumAddress
  chainId: ChainId
  verified: 'yes' | 'no' | 'failed'
  subVerifiers: SubVerifier[]
}

export interface RequiredTool {
  name: string
  version: string
  link?: string
}

export interface SubVerifier {
  name: string
  proofSystem: string
  mainArithmetization: string
  mainPCS: string
  trustedSetup?: 'None' | (string & {})
  link?: string
}

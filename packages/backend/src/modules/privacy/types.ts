import type {
  PrivacyFlowExtractorConfig,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'

export interface PrivacyProjectConfig {
  projectId: string
  privacyInfo: ProjectPrivacyInfo
}

export interface PrivacyConfig {
  projects: PrivacyProjectConfig[]
  flowConfigs: PrivacyFlowIndexerConfig[]
  chains: string[]
  minBlockByChain: Map<string, number>
}

export type PrivacyFlowIndexerConfig = {
  projectId: string
  assetKey: string
  bucketId: string
  direction: 'deposit' | 'withdrawal'
  chain: string
  address?: EthereumAddress
  event: string
  sinceBlock: number
} & PrivacyFlowExtractorConfig

export interface PrivacyRpcLog {
  address: string
  data: string
  topics: string[]
}

export interface PrivacyFlowExtractResult {
  count: number
  amount: bigint
}

import type {
  PrivacyFlowExtractorConfig,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface PrivacyProjectConfig {
  projectId: string
  privacyInfo: ProjectPrivacyInfo
}

export interface PrivacyConfig {
  projects: PrivacyProjectConfig[]
  flowConfigs: PrivacyFlowIndexerConfig[]
  starknetFlowConfigs: StarknetPrivacyFlowIndexerConfig[]
  priceConfigs: PrivacyPriceIndexerConfig[]
  blockTimestampConfigs: PrivacyBlockTimestampConfig[]
  chains: string[]
}

export type PrivacyFlowIndexerConfig = {
  id: string
  projectId: string
  bucketId: string
  direction: 'deposit' | 'withdrawal'
  chain: string
  address: EthereumAddress
  event: string
  sinceTimestamp: UnixTime
  priceId: string
  decimals: number
} & Exclude<
  PrivacyFlowExtractorConfig,
  { extractor: 'strk20Deposit' | 'strk20Withdrawal' }
>

export type StarknetPrivacyFlowIndexerConfig = {
  id: string
  projectId: string
  bucketId: string
  direction: 'deposit' | 'withdrawal'
  chain: string
  address: string
  event: string
  sinceTimestamp: UnixTime
  priceId: string
  decimals: number
} & Extract<
  PrivacyFlowExtractorConfig,
  { extractor: 'strk20Deposit' | 'strk20Withdrawal' }
>

export interface StarknetPrivacyEvent {
  address: string
  blockNumber: number
  transactionHash: string
  eventIndex: number
  keys: string[]
  data: string[]
}

export interface PrivacyBlockTimestampConfig {
  id: string
  chain: string
  sinceTimestamp: UnixTime
}

export interface PrivacyPriceIndexerConfig {
  id: string
  priceId: string
  sinceTimestamp: UnixTime
}

export interface PrivacyRpcLog {
  address: string
  data: string
  topics: string[]
}

export interface PrivacyFlowExtractResult {
  count: number
  amount: bigint
}

import type {
  PrivacyAnonymitySetDepositSource,
  PrivacyFlowExtractorConfig,
  PrivacyRelayerExtractorConfig,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import type { IRpcClient } from '@l2beat/shared'
import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ReceiptLogCache } from './utils/ReceiptLogCache'

export interface PrivacyProjectConfig {
  projectId: string
  privacyInfo: ProjectPrivacyInfo
}

export interface PrivacyConfig {
  projects: PrivacyProjectConfig[]
  anonymitySetConfigs: PrivacyAnonymitySetIndexerConfig[]
  starknetAnonymitySetConfigs: StarknetPrivacyAnonymitySetIndexerConfig[]
  flowConfigs: PrivacyFlowIndexerConfig[]
  starknetFlowConfigs: StarknetPrivacyFlowIndexerConfig[]
  relayerConfigs: PrivacyRelayerActivityIndexerConfig[]
  relayerSampleConfigs: PrivacyRelayerSampleConfig[]
  priceConfigs: PrivacyPriceIndexerConfig[]
  blockTimestampConfigs: PrivacyBlockTimestampConfig[]
  chains: string[]
}

/**
 * Anonymity-set sources read from EVM logs. STRK-20 deposits come from
 * Starknet events and go through their own indexer.
 */
export type EvmPrivacyAnonymitySetDepositSource = Exclude<
  PrivacyAnonymitySetDepositSource,
  { extractor: 'strk20Deposit' }
>

export type PrivacyAnonymitySetIndexerConfigProperties = {
  projectId: string
  bucketId: string
  chain: string
  address: EthereumAddress
  event: string
  sinceTimestamp: UnixTime
} & EvmPrivacyAnonymitySetDepositSource

export type PrivacyAnonymitySetIndexerConfig = {
  id: string
} & PrivacyAnonymitySetIndexerConfigProperties

export type StarknetPrivacyAnonymitySetIndexerConfigProperties = {
  projectId: string
  bucketId: string
  chain: string
  address: string
  event: string
  sinceTimestamp: UnixTime
} & Extract<PrivacyAnonymitySetDepositSource, { extractor: 'strk20Deposit' }>

export type StarknetPrivacyAnonymitySetIndexerConfig = {
  id: string
} & StarknetPrivacyAnonymitySetIndexerConfigProperties

/**
 * Filters on the indexed event args starting at topic1, null matching
 * anything at that position. topic0 is added by the indexer from `event`.
 */
export type PrivacyLogTopicFilter = (string | null)[]

export type PrivacyFlowIndexerConfig = {
  id: string
  projectId: string
  bucketId: string
  direction: 'deposit' | 'withdrawal'
  chain: string
  address: EthereumAddress
  event: string
  /** Derived from the extractor params. */
  topics?: PrivacyLogTopicFilter
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

export type PrivacyRelayerActivityIndexerConfig = {
  id: string
} & PrivacyRelayerActivityIndexerConfigProperties

export type PrivacyRelayerActivityIndexerConfigProperties = {
  projectId: string
  chain: string
  address: EthereumAddress
  sinceTimestamp: UnixTime
  event: string
} & PrivacyRelayerExtractorConfig

export type PrivacyRelayerSampleConfig = {
  id: string
  projectId: string
  chain: string
  chainId: number
  sinceTimestamp: UnixTime
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

export interface PrivacyRelayerActivityExtractResult {
  relayerAddress: EthereumAddress
}

/** Lets extractors read beyond the matched log. Create one per indexer update. */
export interface PrivacyRpcContext {
  rpc: IRpcClient
  receipts: ReceiptLogCache
}

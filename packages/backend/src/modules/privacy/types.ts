import type {
  PrivacyFlowExtractorConfig,
  ProjectPrivacyInfo,
  ProjectPrivacyRelayerSource,
} from '@l2beat/config'
import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface PrivacyProjectConfig {
  projectId: string
  privacyInfo: ProjectPrivacyInfo
}

export interface PrivacyConfig {
  projects: PrivacyProjectConfig[]
  flowConfigs: PrivacyFlowIndexerConfig[]
  relayerConfigs: PrivacyRelayerActivityIndexerConfig[]
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
} & PrivacyFlowExtractorConfig

export type PrivacyRelayerActivityIndexerConfig = {
  id: string
  projectId: string
  chain: string
  address: EthereumAddress
  sinceTimestamp: UnixTime
  event: string
  extractor: ProjectPrivacyRelayerSource['extractor']
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
  recipientAddress: EthereumAddress
}

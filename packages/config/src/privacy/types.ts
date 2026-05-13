import type {
  PrivacyFlowExtractorConfig,
  PrivacyMetricExtractorConfig,
} from '../types'

export interface PrivacyRpcLog {
  address: string
  data: string
  topics: string[]
  blockNumber?: number
  blockTimestamp?: number
}

type ExtractorConfigByName = {
  [K in PrivacyMetricExtractorConfig['extractor']]: Extract<
    PrivacyMetricExtractorConfig,
    { extractor: K }
  >
}

export type PrivacyExtractorName = keyof ExtractorConfigByName

export type PrivacyExtractorInput<K extends PrivacyExtractorName> = {
  logs: PrivacyRpcLog[]
  params: ExtractorConfigByName[K]['params']
}

export type PrivacyExtractor<K extends PrivacyExtractorName> = (
  input: PrivacyExtractorInput<K>,
) => number

export type PrivacyExtractorRegistry = {
  [K in PrivacyExtractorName]: PrivacyExtractor<K>
}

type FlowExtractorConfigByName = {
  [K in PrivacyFlowExtractorConfig['extractor']]: Extract<
    PrivacyFlowExtractorConfig,
    { extractor: K }
  >
}

export type PrivacyFlowExtractorName = keyof FlowExtractorConfigByName

export type PrivacyFlowExtractorInput<K extends PrivacyFlowExtractorName> = {
  log: PrivacyRpcLog
  params: FlowExtractorConfigByName[K]['params']
}

export interface PrivacyFlowExtractResult {
  count: number
  amount: bigint
}

export type PrivacyFlowExtractor<K extends PrivacyFlowExtractorName> = (
  input: PrivacyFlowExtractorInput<K>,
) => PrivacyFlowExtractResult

export type PrivacyFlowExtractorRegistry = {
  [K in PrivacyFlowExtractorName]: PrivacyFlowExtractor<K>
}

import type { PrivacyMetricExtractorConfig } from '../types'

export interface PrivacyRpcLog {
  address: string
  data: string
  topics: string[]
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

import type { PrivacyFlowExtractorRegistry } from '../types'
import { fixedAmount } from './fixedAmount'
import { privacyPoolsValue } from './privacyPoolsValue'
import { railgunShield } from './railgunShield'
import { railgunUnshield } from './railgunUnshield'

export const PRIVACY_FLOW_EXTRACTORS: PrivacyFlowExtractorRegistry = {
  fixedAmount,
  privacyPoolsValue,
  railgunShield,
  railgunUnshield,
}

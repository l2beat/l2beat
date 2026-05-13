import type { PrivacyFlowSource } from '../types'
import { PRIVACY_FLOW_EXTRACTORS } from './flowExtractors'
import type { PrivacyRpcLog } from './types'

export function executeFlowExtract(
  source: PrivacyFlowSource,
  log: PrivacyRpcLog,
) {
  switch (source.extractor) {
    case 'fixedAmount':
      return PRIVACY_FLOW_EXTRACTORS.fixedAmount({
        log,
        params: source.params,
      })
    case 'privacyPoolsValue':
      return PRIVACY_FLOW_EXTRACTORS.privacyPoolsValue({
        log,
        params: source.params,
      })
    case 'railgunShield':
      return PRIVACY_FLOW_EXTRACTORS.railgunShield({
        log,
        params: source.params,
      })
    case 'railgunUnshield':
      return PRIVACY_FLOW_EXTRACTORS.railgunUnshield({
        log,
        params: source.params,
      })
  }
}

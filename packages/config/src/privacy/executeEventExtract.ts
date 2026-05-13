import type { PrivacyMetricSource } from '../types'
import { PRIVACY_EXTRACTORS } from './extractors'
import type { PrivacyRpcLog } from './types'

export function executeEventExtract(
  source: Extract<PrivacyMetricSource, { type: 'eventExtract' }>,
  logs: PrivacyRpcLog[],
): number {
  switch (source.extractor) {
    case 'railgunShieldDeposits':
      return PRIVACY_EXTRACTORS.railgunShieldDeposits({
        logs,
        params: source.params,
      })
  }
}

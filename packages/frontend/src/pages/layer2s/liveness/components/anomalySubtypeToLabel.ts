import { assertUnreachable } from '@l2beat/shared-pure'
import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'

/** Apart from the indicator component, so the markdown of the page words anomalies the same. */
export function anomalySubtypeToLabel(type: LivenessAnomaly['subtype']) {
  switch (type) {
    case 'batchSubmissions':
      return 'Tx data submissions'
    case 'proofSubmissions':
      return 'Proof submissions'
    case 'stateUpdates':
      return 'State updates'
    default:
      assertUnreachable(type)
  }
}

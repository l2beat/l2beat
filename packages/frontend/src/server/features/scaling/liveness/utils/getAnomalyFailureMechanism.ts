import type { ProjectRiskView, TableReadyValue } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export function getAnomalyFailureMechanism(
  subtype: TrackedTxsConfigSubtype,
  riskView: ProjectRiskView | undefined,
): TableReadyValue | undefined {
  switch (subtype) {
    case 'batchSubmissions':
      return riskView?.sequencerFailure
    case 'stateUpdates':
    // state updates are not finalized until proven, so stalled proofs freeze
    // withdrawals just like stalled state updates - proposerFailure covers both
    case 'proofSubmissions':
      return riskView?.proposerFailure
  }
}

import type {
  ProjectLivenessConfig,
  ProjectRiskView,
  TableReadyValue,
} from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

/**
 * Maps an anomaly's tracked-transaction subtype to the matching risk-analysis
 * failure mechanism (Sequencer failure / Proposer failure):
 * - batchSubmissions -> sequencer failure
 * - stateUpdates     -> proposer failure
 * - proofSubmissions -> only when `duplicateData.to === 'proofSubmissions'`,
 *   resolved from the `duplicateData.from` subtype.
 */
export function getAnomalyFailureMechanism(
  subtype: TrackedTxsConfigSubtype,
  riskView: ProjectRiskView | undefined,
  livenessConfig: ProjectLivenessConfig | undefined,
): TableReadyValue | undefined {
  if (!riskView) {
    return undefined
  }

  if (subtype === 'proofSubmissions') {
    const duplicateData = livenessConfig?.duplicateData
    if (!duplicateData || duplicateData.to !== 'proofSubmissions') {
      return undefined
    }
    return failureForSubtype(duplicateData.from, riskView)
  }

  return failureForSubtype(subtype, riskView)
}

function failureForSubtype(
  subtype: TrackedTxsConfigSubtype,
  riskView: ProjectRiskView,
): TableReadyValue | undefined {
  switch (subtype) {
    case 'batchSubmissions':
      return riskView.sequencerFailure
    case 'stateUpdates':
      return riskView.proposerFailure
    case 'proofSubmissions':
      // proofSubmissions cannot resolve directly to a failure mechanism;
      // it must be redirected through `duplicateData.from`.
      return undefined
  }
}

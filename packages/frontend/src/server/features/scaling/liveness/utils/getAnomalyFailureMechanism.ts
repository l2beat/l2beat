import type {
  ProjectLivenessConfig,
  ProjectRiskView,
  TableReadyValue,
} from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export function getAnomalyFailureMechanism(
  subtype: TrackedTxsConfigSubtype,
  riskView: ProjectRiskView | undefined,
  livenessConfig: ProjectLivenessConfig | undefined,
): TableReadyValue | undefined {
  const effectiveSubtype =
    subtype === 'proofSubmissions' &&
    livenessConfig?.duplicateData.to === 'proofSubmissions'
      ? livenessConfig.duplicateData.from
      : subtype

  switch (effectiveSubtype) {
    case 'batchSubmissions':
      return riskView?.sequencerFailure
    case 'stateUpdates':
      return riskView?.proposerFailure
    case 'proofSubmissions':
      return undefined
  }
}

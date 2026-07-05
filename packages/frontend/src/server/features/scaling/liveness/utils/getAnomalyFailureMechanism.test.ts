import type { ProjectRiskView } from '@l2beat/config'
import { expect } from 'earl'
import { getAnomalyFailureMechanism } from './getAnomalyFailureMechanism'

const riskView = {
  sequencerFailure: { value: 'Self sequence' },
  proposerFailure: { value: 'Use escape hatch' },
} as ProjectRiskView

describe(getAnomalyFailureMechanism.name, () => {
  it('returns sequencer failure for batchSubmissions', () => {
    expect(getAnomalyFailureMechanism('batchSubmissions', riskView)).toEqual(
      riskView.sequencerFailure,
    )
  })

  it('returns proposer failure for stateUpdates', () => {
    expect(getAnomalyFailureMechanism('stateUpdates', riskView)).toEqual(
      riskView.proposerFailure,
    )
  })

  it('returns proposer failure for proofSubmissions', () => {
    expect(getAnomalyFailureMechanism('proofSubmissions', riskView)).toEqual(
      riskView.proposerFailure,
    )
  })

  it('returns undefined without a risk view', () => {
    expect(getAnomalyFailureMechanism('batchSubmissions', undefined)).toEqual(
      undefined,
    )
  })
})

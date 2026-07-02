import type { ProjectRiskView } from '@l2beat/config'
import { expect } from 'earl'
import { getAnomalyFailureMechanism } from './getAnomalyFailureMechanism'

const riskView = {
  sequencerFailure: { value: 'Self sequence' },
  proposerFailure: { value: 'Use escape hatch' },
} as ProjectRiskView

describe(getAnomalyFailureMechanism.name, () => {
  it('returns sequencer failure for batchSubmissions', () => {
    expect(
      getAnomalyFailureMechanism('batchSubmissions', riskView, undefined),
    ).toEqual(riskView.sequencerFailure)
  })

  it('returns proposer failure for stateUpdates', () => {
    expect(
      getAnomalyFailureMechanism('stateUpdates', riskView, undefined),
    ).toEqual(riskView.proposerFailure)
  })

  it('returns undefined for proofSubmissions without duplicated data', () => {
    expect(
      getAnomalyFailureMechanism('proofSubmissions', riskView, undefined),
    ).toEqual(undefined)
  })

  it('resolves proofSubmissions through the duplicated subtype', () => {
    expect(
      getAnomalyFailureMechanism('proofSubmissions', riskView, {
        duplicateData: { from: 'stateUpdates', to: 'proofSubmissions' },
      }),
    ).toEqual(riskView.proposerFailure)
  })

  it('ignores duplicated data targeting another subtype', () => {
    expect(
      getAnomalyFailureMechanism('proofSubmissions', riskView, {
        duplicateData: { from: 'proofSubmissions', to: 'stateUpdates' },
      }),
    ).toEqual(undefined)
  })

  it('returns undefined without a risk view', () => {
    expect(
      getAnomalyFailureMechanism('batchSubmissions', undefined, undefined),
    ).toEqual(undefined)
  })
})

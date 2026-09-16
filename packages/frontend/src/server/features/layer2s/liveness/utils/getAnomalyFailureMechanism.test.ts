import type { ProjectRiskView } from '@l2beat/config'
import { describe, expect, it } from 'vitest'
import { getAnomalyFailureMechanism } from './getAnomalyFailureMechanism'

const riskView = {
  sequencerFailure: { value: 'Self sequence' },
  proposerFailure: { value: 'Use escape hatch' },
} as ProjectRiskView

describe(getAnomalyFailureMechanism.name, () => {
  it('returns sequencer failure for batchSubmissions', () => {
    expect(
      getAnomalyFailureMechanism('batchSubmissions', riskView),
    ).toStrictEqual(riskView.sequencerFailure)
  })

  it('returns proposer failure for stateUpdates', () => {
    expect(getAnomalyFailureMechanism('stateUpdates', riskView)).toStrictEqual(
      riskView.proposerFailure,
    )
  })

  it('returns proposer failure for proofSubmissions', () => {
    expect(
      getAnomalyFailureMechanism('proofSubmissions', riskView),
    ).toStrictEqual(riskView.proposerFailure)
  })

  it('returns undefined without a risk view', () => {
    expect(
      getAnomalyFailureMechanism('batchSubmissions', undefined),
    ).toStrictEqual(undefined)
  })
})

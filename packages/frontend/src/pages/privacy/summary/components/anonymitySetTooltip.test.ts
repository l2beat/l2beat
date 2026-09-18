import { expect } from 'earl'
import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'
import {
  getAnonymitySetDescription,
  getAnonymitySetSteps,
  getAnonymitySetSyncingNote,
} from './anonymitySetTooltip'

describe(getAnonymitySetSteps.name, () => {
  it('describes a fixed-denomination pool', () => {
    const summary = makeSummary({ bucketType: 'denomination' })

    expect(getAnonymitySetDescription(summary)).toEqual(
      'Number of unique depositors in the 0.1 ETH bucket during the last 30 complete UTC days.',
    )
    expect(getAnonymitySetSteps(summary, 'Tornado Cash')).toEqual([
      'Deposit into the 0.1 ETH Tornado Cash pool on Ethereum.',
      'Wait for a randomized duration of time up to 30 days. Do not rely on human judgement to pick a random number.',
      'Withdraw to an unlinkable address.',
    ])
  })

  it('describes a variable-amount pool', () => {
    const summary = makeSummary({ bucketType: 'pool' })

    expect(getAnonymitySetDescription(summary)).toEqual(
      'Number of unique depositors who deposited at least 0.1 ETH during the last 30 complete UTC days.',
    )
    expect(getAnonymitySetSteps(summary, 'Privacy Pools')).toEqual([
      'Deposit at most 0.1 ETH into Privacy Pools on Ethereum.',
      'Wait for a randomized duration of time up to 30 days. Do not rely on human judgement to pick a random number.',
      'Withdraw to an unlinkable address. Make sure the withdrawal amount is not equal to the deposit amount, leaving a small amount still deposited.',
    ])
  })

  it('explains which series are excluded while syncing', () => {
    const summary = makeSummary({
      bucketType: 'pool',
      syncingLabels: ['≥200 DAI', '≥20 K DAI'],
    })

    expect(getAnonymitySetSyncingNote(summary)).toEqual(
      'The displayed value excludes series still being indexed: ≥200 DAI, ≥20 K DAI.',
    )
  })
})

function makeSummary({
  bucketType,
  syncingLabels = [],
}: {
  bucketType: 'pool' | 'denomination'
  syncingLabels?: string[]
}): Extract<PrivacyAnonymitySetSummary, { status: 'available' }> {
  return {
    status: 'available',
    value: 69,
    label: bucketType === 'pool' ? '≥0.1 ETH' : '0.1 ETH',
    syncingLabels,
    bucketType,
    chain: 'ethereum',
    formattedAmount: '0.1',
    token: 'ETH',
  }
}

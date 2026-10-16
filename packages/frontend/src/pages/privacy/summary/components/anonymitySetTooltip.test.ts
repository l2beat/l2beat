import { expect } from 'earl'
import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'
import { getAnonymitySetSyncingNote } from './anonymitySetTooltip'

describe(getAnonymitySetSyncingNote.name, () => {
  it('explains which series are excluded while syncing', () => {
    const summary = makeSummary(['≥200 DAI', '≥20 K DAI'])

    expect(getAnonymitySetSyncingNote(summary)).toEqual(
      'The displayed value excludes series still being indexed: ≥200 DAI, ≥20 K DAI.',
    )
  })
})

function makeSummary(
  syncingLabels: string[],
): Extract<PrivacyAnonymitySetSummary, { status: 'available' }> {
  return {
    status: 'available',
    value: 69,
    syncingLabels,
    series: {
      id: 'eth:1',
      projectId: 'project',
      bucketId: 'eth',
      label: '≥0.1 ETH',
      compactLabel: '≥0.1 ETH',
      headlineLabel: '≥0.1 ETH',
      description: '',
      steps: [],
      minimumAmount: '1',
      sinceTimestamp: 0,
    },
  }
}

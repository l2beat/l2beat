import type { PrivacyField } from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getPrivacySummaryGroups } from './privacySummaryGroups'

// Grouping reads only the promise.
function entry(id: string, protects: PrivacyField): PrivacySummaryEntry {
  const fields: Partial<PrivacySummaryEntry> = {
    id,
    adversaries: {
      promise: { protects, text: '' },
      promiseLabel: `${protects} privacy`,
      cells: [],
    },
  }
  return fields as PrivacySummaryEntry
}

describe(getPrivacySummaryGroups.name, () => {
  it('groups entries by promise in a fixed order, skipping empty groups', () => {
    const groups = getPrivacySummaryGroups([
      entry('a', 'amount'),
      entry('b', 'linkage'),
      entry('c', 'linkage'),
    ])

    expect(
      groups.map((group) => ({
        label: group.label,
        ids: group.entries.map((e) => e.id),
      })),
    ).toEqual([
      { label: 'linkage privacy', ids: ['b', 'c'] },
      { label: 'amount privacy', ids: ['a'] },
    ])
  })

  it('throws for a promise without a table', () => {
    expect(() => getPrivacySummaryGroups([entry('a', 'sender')])).toThrow(
      'No privacy summary table for protocols protecting sender',
    )
  })
})

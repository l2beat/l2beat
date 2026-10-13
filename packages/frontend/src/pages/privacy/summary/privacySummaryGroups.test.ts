import type { PrivacyField } from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { ps } from '~/server/projects'
import { getPrivacySummaryGroups } from './privacySummaryGroups'

// Grouping reads only the promise.
function entry(id: string, protects: PrivacyField): PrivacySummaryEntry {
  const fields: Partial<PrivacySummaryEntry> = {
    id,
    adversaries: {
      promise: { protects, text: '' },
      promiseLabel: '',
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
      { label: 'Link privacy', ids: ['b', 'c'] },
      { label: 'Amount privacy', ids: ['a'] },
    ])
  })

  it('throws for a promise without a table', () => {
    expect(() => getPrivacySummaryGroups([entry('a', 'sender')])).toThrow(
      'No privacy summary table for protocols protecting sender',
    )
  })

  it('has a table, labelled as in the config, for every promise in it', async () => {
    const projects = await ps.getProjects({ select: ['privacyInfo'] })
    const groups = getPrivacySummaryGroups(
      projects.map((project) =>
        entry(project.id, project.privacyInfo.adversaries.promise.protects),
      ),
    )

    expect(groups.flatMap((group) => group.entries).length).toEqual(
      projects.length,
    )
    const fields = projects[0]?.privacyInfo.adversaries.fields ?? []
    for (const group of groups) {
      const field = fields.find((field) => field.id === group.field)
      expect(field?.promiseLabel).toEqual(group.label)
    }
  })
})

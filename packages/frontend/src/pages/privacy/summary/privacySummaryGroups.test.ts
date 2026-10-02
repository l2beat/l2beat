import type { PrivacyField, PrivacyFieldInfo } from '@l2beat/config'
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

function field(id: PrivacyField): PrivacyFieldInfo {
  return {
    id,
    label: id,
    subject: id,
    promiseLabel: `${id} privacy`,
    description: '',
  }
}

describe(getPrivacySummaryGroups.name, () => {
  const FIELDS = (['linkage', 'recipient', 'amount', 'sender'] as const).map(
    field,
  )

  it('groups entries by promise in a fixed order, skipping empty groups', () => {
    const groups = getPrivacySummaryGroups(
      [entry('a', 'amount'), entry('b', 'linkage'), entry('c', 'linkage')],
      FIELDS,
    )

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
    expect(() =>
      getPrivacySummaryGroups([entry('a', 'sender')], FIELDS),
    ).toThrow('No privacy summary table for protocols protecting sender')
  })

  it('has a table for every promise in the config', async () => {
    const projects = await ps.getProjects({ select: ['privacyInfo'] })
    const entries = projects.map((project) =>
      entry(project.id, project.privacyInfo.adversaries.promise.protects),
    )
    const [first] = projects

    const groups = getPrivacySummaryGroups(
      entries,
      first?.privacyInfo.adversaries.fields ?? [],
    )

    expect(groups.flatMap((group) => group.entries).length).toEqual(
      projects.length,
    )
  })
})

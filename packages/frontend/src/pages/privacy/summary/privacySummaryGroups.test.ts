import type { PrivacyField } from '@l2beat/config'
import { expect } from 'earl'
import {
  getPrivacyAnonymitySetType,
  type PrivacyAnonymitySetType,
} from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSeries'
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

  it('describes the anonymity set as key registrations only for recipient privacy', () => {
    const groups = getPrivacySummaryGroups([
      entry('a', 'linkage'),
      entry('b', 'recipient'),
    ])

    expect(
      groups.map((group) => [group.label, group.anonymitySetTooltip]),
    ).toEqual([
      [
        'Link privacy',
        'Unique depositors over the last 30 complete UTC days, in the largest tracked pool.',
      ],
      [
        'Recipient privacy',
        'Unique addresses that registered stealth keys in the last 30 complete UTC days.',
      ],
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

  // The header names one kind of anonymity set per table, so a project
  // counting another kind would sit under the wrong sentence.
  it('heads every table with the anonymity set type of its projects', async () => {
    const projects = await ps.getProjects({ select: ['privacyInfo'] })
    const groups = getPrivacySummaryGroups(
      projects.map((project) =>
        entry(project.id, project.privacyInfo.adversaries.promise.protects),
      ),
    )

    const typeById = new Map<string, PrivacyAnonymitySetType | undefined>(
      projects.map((project) => [
        project.id,
        getPrivacyAnonymitySetType(project),
      ]),
    )

    for (const group of groups) {
      if (group.anonymitySetType === undefined) continue
      for (const { id } of group.entries) {
        const type = typeById.get(id)
        if (type !== undefined) {
          expect({ id, type }).toEqual({ id, type: group.anonymitySetType })
        }
      }
    }
  })
})

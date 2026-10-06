import { expect } from 'earl'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { toPrivacyProjectCellProject } from './toPrivacyProjectCellProject'

// Only the fields the mapper reads matter; the rest of the entry is data
// for other columns.
function entry(overrides: Partial<PrivacySummaryEntry>): PrivacySummaryEntry {
  return {
    name: 'Payy',
    slug: 'payy',
    icon: '/icons/payy.png',
    href: '/privacy/projects/payy',
    description: 'Private payments',
    isUnderReview: false,
    ...overrides,
  } as PrivacySummaryEntry
}

describe(toPrivacyProjectCellProject.name, () => {
  it('forwards the red warning so the name cell shows the shield and text', () => {
    const redWarning = { text: 'Exploited. Do not deposit funds.' }

    const project = toPrivacyProjectCellProject(entry({ redWarning }))

    expect(project.statuses.redWarning).toEqual(redWarning)
  })

  it('points warning detail links at the privacy project page', () => {
    // Privacy-only projects have no /layer2s page, so the default L2 details
    // link would be a dead end.
    const project = toPrivacyProjectCellProject(entry({}))

    expect(project.detailsHref).toEqual('/privacy/projects/payy')
  })
})

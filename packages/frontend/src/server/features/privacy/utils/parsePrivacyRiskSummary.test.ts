import { expect } from 'earl'
import { parsePrivacyRiskSummary } from './parsePrivacyRiskSummary'

describe(parsePrivacyRiskSummary.name, () => {
  it('reads each heading as a group of plain-text items linking to a section', () => {
    const groups = parsePrivacyRiskSummary(
      [
        '## Funds can be stolen if',
        '1. the verifier accepts an invalid proof.',
        '2. the owner pushes a malicious [**upgrade**](#upgrades).',
        '<br>',
        '## Privacy can be lost if',
        '1. the backend leaks data,',
        '   tied to KYC records.',
        '2. cryptography breaks.',
      ].join('\n'),
      { hasDescription: true },
    )

    expect(
      groups.map((group) => ({
        name: group.name,
        items: group.items.map(
          (item) => `${item.text} -> ${item.referencedId}`,
        ),
      })),
    ).toEqual([
      {
        name: 'Funds can be stolen if',
        items: [
          'the verifier accepts an invalid proof. -> detailed-description',
          'the owner pushes a malicious upgrade. -> upgrades',
        ],
      },
      {
        name: 'Privacy can be lost if',
        items: [
          'the backend leaks data, tied to KYC records. -> privacy-adversaries',
          'cryptography breaks. -> privacy-adversaries',
        ],
      },
    ])
  })

  it('links to the adversaries on a page without a description', () => {
    const [group] = parsePrivacyRiskSummary(
      '## Funds can be stolen if\n1. the verifier accepts an invalid proof.',
      { hasDescription: false },
    )

    expect(group?.items[0]?.referencedId).toEqual('privacy-adversaries')
  })
})

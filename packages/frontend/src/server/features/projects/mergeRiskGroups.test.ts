import { expect } from 'earl'
import { mergeRiskGroups } from './mergeRiskGroups'

describe(mergeRiskGroups.name, () => {
  const generated = [
    {
      start: 1,
      name: 'Funds can be stolen if',
      items: [
        {
          text: 'a malicious upgrade.',
          referencedId: 'upgrades',
          isCritical: true,
        },
      ],
    },
    {
      start: 2,
      name: 'Funds can be frozen if',
      items: [
        {
          text: 'the operator stops.',
          referencedId: 'operator',
          isCritical: false,
        },
      ],
    },
  ]
  const handWritten = [
    '## Funds can be stolen if',
    '1. the verifier accepts an invalid proof.',
    '2. the owner pushes a malicious [**upgrade**](#upgrades).',
    '<br>',
    '## Privacy can be lost if',
    '1. the backend leaks data,',
    '   tied to KYC records.',
    '2. cryptography breaks.',
  ].join('\n')

  it('adds the items under shared headings and the other groups after', () => {
    const merged = mergeRiskGroups(generated, handWritten, (group) =>
      group === 'Privacy can be lost if' ? 'adversaries' : 'description',
    )

    expect(
      merged.map((group) => ({
        start: group.start,
        name: group.name,
        items: group.items.map(
          (item) => `${item.text} -> ${item.referencedId}`,
        ),
      })),
    ).toEqual([
      {
        start: 1,
        name: 'Funds can be stolen if',
        items: [
          'a malicious upgrade. -> upgrades',
          'the verifier accepts an invalid proof. -> description',
          'the owner pushes a malicious upgrade. -> upgrades',
        ],
      },
      {
        start: 4,
        name: 'Funds can be frozen if',
        items: ['the operator stops. -> operator'],
      },
      {
        start: 5,
        name: 'Privacy can be lost if',
        items: [
          'the backend leaks data, tied to KYC records. -> adversaries',
          'cryptography breaks. -> adversaries',
        ],
      },
    ])
  })

  it('leaves the generated groups as they are without hand-written ones', () => {
    expect(mergeRiskGroups(generated, undefined, () => '')).toEqual(generated)
  })
})

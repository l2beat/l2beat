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
    '<br>',
    '## Privacy can be lost if',
    '1. the backend leaks data,',
    '   tied to KYC records.',
    '2. cryptography breaks.',
  ].join('\n')

  it('adds the items under shared headings and the other groups after', () => {
    const merged = mergeRiskGroups(generated, handWritten)

    expect(
      merged.map((group) => ({
        start: group.start,
        name: group.name,
        items: group.items.map((item) => item.text),
      })),
    ).toEqual([
      {
        start: 1,
        name: 'Funds can be stolen if',
        items: [
          'a malicious upgrade.',
          'the verifier accepts an invalid proof.',
        ],
      },
      {
        start: 3,
        name: 'Funds can be frozen if',
        items: ['the operator stops.'],
      },
      {
        start: 4,
        name: 'Privacy can be lost if',
        items: [
          'the backend leaks data, tied to KYC records.',
          'cryptography breaks.',
        ],
      },
    ])
  })

  it('leaves the generated groups as they are without hand-written ones', () => {
    expect(mergeRiskGroups(generated, undefined)).toEqual(generated)
  })
})

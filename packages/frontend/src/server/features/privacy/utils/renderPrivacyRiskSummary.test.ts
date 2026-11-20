import { expect } from 'earl'
import { renderPrivacyRiskSummary } from './renderPrivacyRiskSummary'

describe(renderPrivacyRiskSummary.name, () => {
  it('numbers each category from one and links the cells in the given order', () => {
    const markdown = renderPrivacyRiskSummary([
      {
        category: 'Funds can be stolen if',
        risks: [
          { text: 'the proof is broken.' },
          { text: 'the admin upgrades.' },
        ],
      },
      {
        category: 'Privacy can be lost if',
        risks: [
          {
            text: 'the default endpoints see both ends.',
            see: ['privilegedInsider', 'networkObserver'],
          },
        ],
      },
    ])

    expect(markdown).toEqual(
      [
        '## Funds can be stolen if',
        '1. the proof is broken.',
        '2. the admin upgrades.',
        '<br>',
        '## Privacy can be lost if',
        '1. the default endpoints see both ends (see [privileged insider](#privacy-adversaries-privileged-insider) and [network observer](#privacy-adversaries-network-observer)).',
      ].join('\n'),
    )
  })
})

import { PRIVACY_ADVERSARIES } from '@l2beat/config/build/common/privacyAdversaries'
import { expect } from 'earl'
import { renderPrivacyRiskSummary } from './renderPrivacyRiskSummary'

describe(renderPrivacyRiskSummary.name, () => {
  const adversaries = Object.values(PRIVACY_ADVERSARIES)

  it('numbers each category from one and links the cells in the given order', () => {
    const markdown = renderPrivacyRiskSummary(
      [
        { category: 'Funds can be stolen if', text: 'the proof is broken.' },
        { category: 'Funds can be stolen if', text: 'the admin upgrades.' },
        {
          category: 'Privacy can be lost if',
          text: 'the default endpoints see both ends.',
          see: ['privilegedInsider', 'networkObserver'],
        },
      ],
      adversaries,
    )

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

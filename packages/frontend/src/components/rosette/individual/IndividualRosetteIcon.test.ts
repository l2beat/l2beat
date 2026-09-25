import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { RosetteValue } from '../types'
import {
  IndividualPizzaRosetteIcon,
  type RosetteValueTuple,
} from './IndividualRosetteIcon'

// The L2+L3 rosette colours two rings of slices. We render it to static
// markup and check the desc names both projects and every risk sentiment.
describe(IndividualPizzaRosetteIcon.name, () => {
  it('describes the risks of both the L2 and the L3', () => {
    const html = renderToStaticMarkup(
      createElement(IndividualPizzaRosetteIcon, {
        l2: { name: 'Base', risks: risks('good') },
        l3: { name: 'Degen', risks: risks('bad') },
      }),
    )

    expect(html).toInclude(
      'Base risks: Sequencer failure: Self sequence, good; ',
    )
    expect(html).toInclude(
      'Degen risks: Sequencer failure: Self sequence, bad;',
    )
    expect(html).toInclude('Proposer failure: Self propose, bad</desc>')
  })
})

function risks(sentiment: RosetteValue['sentiment']): RosetteValueTuple {
  return [
    { name: 'Sequencer failure', value: 'Self sequence', sentiment },
    { name: 'State validation', value: 'Fraud proofs', sentiment },
    { name: 'Data availability', value: 'Onchain', sentiment },
    { name: 'Exit window', value: '7d', sentiment },
    { name: 'Proposer failure', value: 'Self propose', sentiment },
  ]
}

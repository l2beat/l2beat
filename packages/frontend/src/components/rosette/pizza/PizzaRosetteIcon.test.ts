import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'

// Readers without colour vision (screen readers, LLMs parsing the HTML) only
// get the risk sentiments if the server-rendered SVG spells them out, so we
// render the icon to static markup and look for the text equivalents.
const VALUES: RosetteValue[] = [
  { name: 'Sequencer failure', value: 'Self sequence', sentiment: 'warning' },
  { name: 'State validation', value: 'Fraud proofs', sentiment: 'good' },
  { name: 'Data availability', value: 'Onchain', sentiment: 'good' },
  { name: 'Exit window', value: 'None', sentiment: 'bad' },
  { name: 'Proposer failure', value: 'Self propose', sentiment: 'good' },
]

describe(PizzaRosetteIcon.name, () => {
  it('describes every risk with its sentiment in title and desc', () => {
    const html = renderToStaticMarkup(
      createElement(PizzaRosetteIcon, { values: VALUES }),
    )

    expect(html).toMatchRegex(/<title[^>]*>Risk rosette<\/title>/)
    expect(html).toInclude(
      '<desc id="' +
        getAttribute(html, 'aria-describedby') +
        '">Sequencer failure: Self sequence, warning; ' +
        'State validation: Fraud proofs, good; ' +
        'Data availability: Onchain, good; ' +
        'Exit window: None, bad; ' +
        'Proposer failure: Self propose, good</desc>',
    )
    expect(html).toInclude(
      `<title id="${getAttribute(html, 'aria-labelledby')}">`,
    )
    expect(html).not.toInclude('alt-text')
  })

  it('reports every risk as under review when the rosette is greyed out', () => {
    const html = renderToStaticMarkup(
      createElement(PizzaRosetteIcon, { values: VALUES, isUnderReview: true }),
    )

    expect(html).toInclude('Sequencer failure: Self sequence, under review;')
    expect(html).toInclude('Exit window: None, under review;')
  })
})

function getAttribute(html: string, name: string): string {
  const match = html.match(new RegExp(`${name}="([^"]+)"`))
  if (!match?.[1]) throw new Error(`Missing ${name}`)
  return match[1]
}

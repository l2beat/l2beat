import { expect } from 'earl'
import { type ComponentProps, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { GlossaryContextProvider } from '../markdown/GlossaryContext'
import { RiskBanner } from './RiskBanner'

// A risk banner shows its sentiment through the stick and text colour only.
// We render it to static markup and check the sentiment also appears as
// visually hidden text after each coloured value.
describe(RiskBanner.name, () => {
  it('states the sentiment of the risk value', () => {
    const html = renderBanner({
      name: 'Sequencer failure',
      value: 'Self sequence',
      sentiment: 'warning',
    })

    expect(html).toInclude(
      'Self sequence<span class="sr-only">, warning</span>',
    )
  })

  it('states the sentiment of the regular upgrade path', () => {
    const html = renderBanner({
      name: 'Exit window',
      value: 'None',
      sentiment: 'bad',
      regular: { value: '7d', sentiment: 'good', description: 'Slow' },
    })

    expect(html).toInclude(
      '(emergency upgrade path)<span class="sr-only">, bad</span>',
    )
    expect(html).toInclude(
      '(regular upgrade path)<span class="sr-only">, good</span>',
    )
  })

  it('states the sentiment of the warning', () => {
    const html = renderBanner({
      name: 'State validation',
      value: 'Fraud proofs',
      sentiment: 'good',
      warning: { value: 'Few challengers', sentiment: 'bad' },
    })

    expect(html).toInclude('Fraud proofs<span class="sr-only">, good</span>')
    expect(html).toMatchRegex(/Few challengers.*<span class="sr-only">, bad/)
  })

  it('states under review for a risk still being assessed', () => {
    const html = renderBanner({
      name: 'Data availability',
      value: 'Onchain',
      sentiment: 'UnderReview',
    })

    expect(html).toInclude('Onchain<span class="sr-only">, under review</span>')
  })
})

function renderBanner(props: ComponentProps<typeof RiskBanner>): string {
  return renderToStaticMarkup(
    createElement(GlossaryContextProvider, {
      terms: [],
      // biome-ignore lint/correctness/noChildrenProp: the provider's props type requires children, so createElement cannot take them positionally
      children: createElement(RiskBanner, props),
    }),
  )
}

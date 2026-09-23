import { expect } from 'earl'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ChartFigure } from './ChartFigure'

// Rendered with renderToString, the same call the SSR entry uses, so the
// assertions describe the HTML a crawler receives before hydration.
describe(ChartFigure.name, () => {
  it('wraps the chart in a figure with the caption', () => {
    const html = render({ caption: 'Total value secured by Foo.' })

    expect(html).toMatchRegex(
      /^<figure[^>]*><div id="chart"><\/div>.*<figcaption[^>]*>Total value secured by Foo.<\/figcaption><\/figure>$/,
    )
  })

  it('links the JSON endpoint of the series when there is one', () => {
    const html = render({
      caption: 'Total value secured by Foo.',
      jsonUrl: '/api/scaling/tvs/foo?range=1y',
    })

    expect(html).toMatchRegex(
      /<a [^>]*href="\/api\/scaling\/tvs\/foo\?range=1y"[^>]*type="application\/json"[^>]*>JSON<\/a>/,
    )
  })

  it('renders no JSON link without an endpoint', () => {
    const html = render({ caption: 'Total value secured by Foo.' })

    expect(html).not.toInclude('JSON')
  })
})

function render(props: { caption: string; jsonUrl?: string }) {
  return renderToString(
    createElement(ChartFigure, {
      ...props,
      // biome-ignore lint/correctness/noChildrenProp: createElement's typings only accept required children through props
      children: createElement('div', { id: 'chart' }),
    }),
  )
}

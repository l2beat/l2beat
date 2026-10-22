import { expect } from 'earl'
import { renderToString } from 'react-dom/server'
import { Activity } from './Activity'

/**
 * Rendered on the server, as the first paint is, and read from the bars'
 * attributes and inline styles: that is where the row's look is set before
 * any motion.
 */
describe(Activity.name, () => {
  it('draws each bar as tall as its share of the scale, a sliver for none', () => {
    const bars = renderBars([0, 5, 10])

    // scale 10: a sliver, 0.2 + 0.8 * 5 / 10 and the full 20 px
    expect(bars.map((bar) => bar.height)).toEqual(['1.6', '12', '20'])
  })

  it('stands every bar on the bottom of the row, oldest on the left', () => {
    const bars = renderBars([0, 5, 10])

    expect(bars.map((bar) => [bar.x, bar.y])).toEqual([
      ['0', '18.4'],
      ['3', '8'],
      ['6', '0'],
    ])
  })

  // As a block lands, iOS Safari repaints the rows it touches, and paints
  // each box in a row on its own
  it('draws the row as one box', () => {
    const html = renderToString(
      <Activity buckets={[0, 5, 10]} firstBucket={100} color="#ff0000" />,
    )

    expect(html.match(/<(?!rect|\/)[a-z]+/g)).toEqual(['<div', '<svg'])
  })

  it('dims past bars and shows the current one in full', () => {
    const bars = renderBars([0, 5, 10])

    expect(bars.map((bar) => bar.fill)).toEqual([
      'var(--divider)',
      'rgba(255, 0, 0, 0.6)',
      '#ff0000',
    ])
  })

  // A bar with either is a layer of its own, and while any animation runs off
  // the compositor, WebKit goes through every layer on each frame
  it('gives no bar a transform or an opacity of its own', () => {
    const bars = renderBars([0, 5, 10])

    for (const bar of bars) {
      expect(bar.transform).toEqual(undefined)
      expect(bar.opacity).toEqual(undefined)
    }
  })
})

function renderBars(buckets: number[]) {
  const html = renderToString(
    <Activity buckets={buckets} firstBucket={100} color="#ff0000" />,
  )
  return [...html.matchAll(/<rect([^>]*)>/g)].map(([, attributes]) =>
    parseBar(attributes ?? ''),
  )
}

function parseBar(attributes: string) {
  const attribute = (name: string) =>
    attributes.match(new RegExp(` ${name}="([^"]*)"`))?.[1]
  const declarations = new Map(
    (attribute('style') ?? '')
      .split(';')
      .filter(Boolean)
      .map((declaration) => {
        const [name = '', ...value] = declaration.split(':')
        return [name.trim(), value.join(':').trim()]
      }),
  )
  return {
    x: attribute('x'),
    y: attribute('y'),
    height: attribute('height'),
    fill: declarations.get('fill'),
    transform: attribute('transform') ?? declarations.get('transform'),
    opacity: declarations.get('opacity') ?? declarations.get('fill-opacity'),
  }
}

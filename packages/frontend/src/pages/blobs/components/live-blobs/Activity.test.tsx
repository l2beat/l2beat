import { expect } from 'earl'
import { renderToString } from 'react-dom/server'
import { Activity } from './Activity'

/**
 * Rendered on the server, as the first paint is, and read from the bars'
 * inline styles: that is where the row's look is set before any motion.
 */
describe(Activity.name, () => {
  it('draws each bar as tall as its share of the scale, a sliver for none', () => {
    const bars = renderBars([0, 5, 10])

    // scale 10: a sliver, 0.2 + 0.8 * 5 / 10 and the full 20 px
    expect(bars.map((bar) => bar.height)).toEqual(['1.6px', '12px', '20px'])
  })

  it('dims past bars and shows the current one in full', () => {
    const bars = renderBars([0, 5, 10])

    expect(bars.map((bar) => bar.background)).toEqual([
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
  // the bars are the row's only empty elements with a style
  const styles = [...html.matchAll(/<div[^>]*style="([^"]*)"[^>]*><\/div>/g)]
  return styles.map(([, style]) => parseStyle(style ?? ''))
}

function parseStyle(style: string) {
  const declarations = new Map(
    style
      .split(';')
      .filter(Boolean)
      .map((declaration) => {
        const [name = '', ...value] = declaration.split(':')
        return [name.trim(), value.join(':').trim()]
      }),
  )
  return {
    height: declarations.get('height'),
    background: declarations.get('background-color'),
    transform: declarations.get('transform'),
    opacity: declarations.get('opacity'),
  }
}

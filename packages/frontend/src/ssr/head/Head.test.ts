import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Manifest } from '~/utils/Manifest'
import { getMetadata } from './getMetadata'
import { Head } from './Head'

// Method: build metadata the way page data fetchers do (from the page URL
// alone) and render the real <Head> to static HTML, then look for the
// alternate link agents discover the markdown version by.
describe(Head.name, () => {
  const manifest: Manifest = {
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1200, height: 630 }),
  }

  it('links the markdown alternate of project and list pages', () => {
    for (const url of ['/layer2s/projects/arbitrum', '/layer2s/summary']) {
      expect(renderHead(url)).toInclude(
        `<link rel="alternate" type="text/markdown" href="https://l2beat.com${url}.md"/>`,
      )
    }
  })

  it('links the alternate of the page, whatever its query', () => {
    expect(renderHead('/layer2s/projects/arbitrum?update=1')).toInclude(
      'href="https://l2beat.com/layer2s/projects/arbitrum.md"',
    )
  })

  it('has no markdown alternate on pages without a markdown version', () => {
    expect(renderHead('/faq')).not.toInclude('text/markdown')
  })

  function renderHead(url: string) {
    const metadata = getMetadata(manifest, {
      url,
      openGraph: { image: '/meta-images/og.png' },
    })
    return renderToStaticMarkup(createElement(Head, { manifest, metadata }))
  }
})

import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Manifest } from '~/utils/Manifest'
import { getMetadata } from './getMetadata'
import { Head } from './Head'

// Method: build metadata the way page data fetchers do and render the real
// <Head> to static HTML, then look for the alternate link agents discover
// the markdown version by.
describe(Head.name, () => {
  const manifest: Manifest = {
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1200, height: 630 }),
  }

  it('links the markdown alternate when the page has one', () => {
    const metadata = getMetadata(manifest, {
      url: '/layer2s/projects/arbitrum',
      openGraph: { image: '/meta-images/og.png' },
      markdownAlternatePath: '/layer2s/projects/arbitrum.md',
    })

    const html = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    // The origin depends on the deployment environment, the path does not.
    expect(html).toMatchRegex(
      /<link rel="alternate" type="text\/markdown" href="https?:\/\/[^"/]+\/layer2s\/projects\/arbitrum\.md"\/>/,
    )
  })

  it('has no markdown alternate by default', () => {
    const metadata = getMetadata(manifest, {
      url: '/layer2s/summary',
      openGraph: { image: '/meta-images/og.png' },
    })

    const html = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(html).not.toInclude('text/markdown')
  })
})

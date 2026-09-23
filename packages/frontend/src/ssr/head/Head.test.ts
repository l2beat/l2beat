import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Manifest } from '~/utils/Manifest'
import type { Metadata } from './getMetadata'
import { Head } from './Head'

// Renders the head the way the SSR entry does and inspects the markup.
describe(Head.name, () => {
  const manifest: Manifest = {
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 0, height: 0 }),
  }
  const metadata: Metadata = {
    title: 'Foo - L2BEAT',
    description: 'Foo description',
    url: 'https://l2beat.com/scaling/projects/foo',
    canonicalUrl: 'https://l2beat.com/scaling/projects/foo',
    openGraph: { type: 'website', image: 'https://l2beat.com/og.png' },
  }

  it('links the JSON alternates of the page', () => {
    const html = renderToStaticMarkup(
      createElement(Head, {
        manifest,
        metadata: {
          ...metadata,
          jsonAlternates: [
            {
              title: 'Foo value secured (JSON)',
              href: '/api/scaling/tvs/foo?range=1y',
            },
          ],
        },
      }),
    )

    expect(html).toInclude(
      '<link rel="alternate" type="application/json" href="/api/scaling/tvs/foo?range=1y" title="Foo value secured (JSON)"/>',
    )
  })

  it('renders no alternates for pages without JSON endpoints', () => {
    const html = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(html).not.toInclude('rel="alternate"')
  })
})

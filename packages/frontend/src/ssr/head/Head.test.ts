import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { identityManifest as manifest } from '~/test/identityManifest'
import { getMetadata } from './getMetadata'
import { Head } from './Head'

// Method: build metadata the way page data fetchers do and render the real
// <Head> to static HTML, then read back what a crawler or agent looks for:
// the JSON-LD scripts and the alternate link to the markdown version.
describe(Head.name, () => {
  it('renders every structured data block as a JSON-LD script', () => {
    const metadata = getMetadata(manifest, {
      title: 'FAQ - L2BEAT',
      url: '/faq',
      openGraph: { image: '/meta-images/og.png' },
      structuredData: [
        { '@context': 'https://schema.org', '@type': 'FAQPage' },
      ],
    })

    const html = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(readJsonLd(html)).toEqual(metadata.structuredData)
  })

  it('keeps text from closing the script tag early', () => {
    const metadata = getMetadata(manifest, {
      title: 'FAQ - L2BEAT',
      url: '/faq',
      openGraph: { image: '/meta-images/og.png' },
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Answer',
          text: '</script><script>alert(1)</script>',
        },
      ],
    })

    const html = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(html).not.toInclude('<script>alert(1)')
    expect(readJsonLd(html)[1]).toEqual(metadata.structuredData[1])
  })

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

function readJsonLd(html: string): unknown[] {
  const scripts = html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/g,
  )
  return [...scripts].map(([, json]) => JSON.parse(json ?? ''))
}

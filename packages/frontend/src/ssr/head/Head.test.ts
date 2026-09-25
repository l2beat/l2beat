import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { identityManifest as manifest } from '~/test/identityManifest'
import { getMetadata } from './getMetadata'
import { Head } from './Head'

// Renders the head the way ServerEntry does and reads the JSON-LD back out
// of the markup, as a crawler would.
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
})

function readJsonLd(html: string): unknown[] {
  const scripts = html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/g,
  )
  return [...scripts].map(([, json]) => JSON.parse(json ?? ''))
}

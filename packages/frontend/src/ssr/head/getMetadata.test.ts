import { expect } from 'earl'
import type { Manifest } from '~/utils/Manifest'
import { getMetadata } from './getMetadata'

// Breadcrumb URLs are absolute production URLs so they agree with the
// canonical link whatever host rendered the page.
describe(getMetadata.name, () => {
  const manifest: Manifest = {
    getUrl: (url) => url,
    getImage: (url) => ({ src: url, width: 1, height: 1 }),
  }
  const openGraph = { image: '/meta-images/og.png' }

  describe('BreadcrumbList', () => {
    it('leads from Home through the section to the page', () => {
      const metadata = getMetadata(manifest, {
        title: 'Arbitrum One - L2BEAT',
        url: '/layer2s/projects/arbitrum?tab=risks',
        openGraph,
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'Scaling', 'https://l2beat.com/layer2s/summary'),
        crumb(
          3,
          'Arbitrum One',
          'https://l2beat.com/layer2s/projects/arbitrum',
        ),
      ])
    })

    it('skips the section when the page does not belong to one', () => {
      const metadata = getMetadata(manifest, {
        title: 'FAQ - L2BEAT',
        url: '/faq',
        openGraph,
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'FAQ', 'https://l2beat.com/faq'),
      ])
    })

    it('ends at the section on the section landing page', () => {
      const metadata = getMetadata(manifest, {
        url: '/layer2s/summary',
        openGraph,
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'Scaling', 'https://l2beat.com/layer2s/summary'),
      ])
    })

    it('names the page and its parents when the caller provides them', () => {
      const metadata = getMetadata(manifest, {
        title: 'Arbitrum One | TVS Breakdown - L2BEAT',
        url: '/layer2s/projects/arbitrum/tvs-breakdown',
        openGraph,
        breadcrumb: {
          name: 'TVS Breakdown',
          parents: [
            { name: 'Arbitrum One', path: '/layer2s/projects/arbitrum' },
          ],
        },
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'Scaling', 'https://l2beat.com/layer2s/summary'),
        crumb(
          3,
          'Arbitrum One',
          'https://l2beat.com/layer2s/projects/arbitrum',
        ),
        crumb(
          4,
          'TVS Breakdown',
          'https://l2beat.com/layer2s/projects/arbitrum/tvs-breakdown',
        ),
      ])
    })

    it('is omitted on the home page, which has nothing above it', () => {
      const metadata = getMetadata(manifest, {
        title: 'L2BEAT',
        url: '/',
        openGraph,
      })

      expect(getBreadcrumbItems(metadata)).toEqual(undefined)
    })
  })

  it('keeps page-specific structured data after the breadcrumbs', () => {
    const metadata = getMetadata(manifest, {
      title: 'FAQ - L2BEAT',
      url: '/faq',
      openGraph,
      structuredData: [
        { '@context': 'https://schema.org', '@type': 'FAQPage' },
      ],
    })

    expect(metadata.structuredData.map((data) => data['@type'])).toEqual([
      'BreadcrumbList',
      'FAQPage',
    ])
  })

  it('emits no structured data on pages hidden from search engines', () => {
    const metadata = getMetadata(manifest, {
      title: 'Page not found - L2BEAT',
      url: '/nonexistent',
      openGraph,
      excludeFromSearchEngines: true,
      structuredData: [{ '@context': 'https://schema.org', '@type': 'Thing' }],
    })

    expect(metadata.structuredData).toEqual([])
  })
})

function getBreadcrumbItems(metadata: ReturnType<typeof getMetadata>) {
  return metadata.structuredData.find(
    (data) => data['@type'] === 'BreadcrumbList',
  )?.itemListElement
}

function crumb(position: number, name: string, item: string) {
  return { '@type': 'ListItem', position, name, item }
}

import { expect } from 'earl'
import { identityManifest as manifest } from '~/test/identityManifest'
import type { Manifest } from '~/utils/Manifest'
import { getMetadata } from './getMetadata'
import type { StructuredDataPage } from './structured-data/StructuredData'

// Each case feeds getMetadata the inputs a page loader would and reads the
// result back the way the head does. Breadcrumb URLs are absolute production
// URLs so they agree with the canonical link whatever host rendered the page.
describe(getMetadata.name, () => {
  const openGraph = { image: '/meta-images/og.png' }

  describe('title', () => {
    it('is the page name followed by the site name', () => {
      const metadata = getMetadata(manifest, {
        name: 'FAQ',
        url: '/faq',
        openGraph,
      })

      expect(metadata.title).toEqual('FAQ - L2BEAT')
    })

    it('can say more than the name, which still names the breadcrumb', () => {
      const metadata = getMetadata(manifest, {
        name: 'Aave',
        title: 'Aave - DeFi - L2BEAT',
        url: '/defi/projects/aave',
        openGraph,
      })

      expect(metadata.title).toEqual('Aave - DeFi - L2BEAT')
      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'DeFi', 'https://l2beat.com/defi/summary'),
        crumb(3, 'Aave', 'https://l2beat.com/defi/projects/aave'),
      ])
    })
  })

  describe('BreadcrumbList', () => {
    it('leads from Home through the section to the page', () => {
      const metadata = getMetadata(manifest, {
        name: 'Arbitrum One',
        url: '/layer2s/projects/arbitrum?tab=risks',
        openGraph,
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'Layer 2s', 'https://l2beat.com/layer2s/summary'),
        crumb(
          3,
          'Arbitrum One',
          'https://l2beat.com/layer2s/projects/arbitrum',
        ),
      ])
    })

    it('skips the section when the page does not belong to one', () => {
      const metadata = getMetadata(manifest, {
        name: 'FAQ',
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
        crumb(2, 'Layer 2s', 'https://l2beat.com/layer2s/summary'),
      ])
    })

    it('names the page and its parents when the caller provides them', () => {
      const metadata = getMetadata(manifest, {
        name: 'TVS Breakdown',
        title: 'Arbitrum One | TVS Breakdown - L2BEAT',
        url: '/layer2s/projects/arbitrum/tvs-breakdown',
        openGraph,
        breadcrumbParents: [
          { name: 'Arbitrum One', path: '/layer2s/projects/arbitrum' },
        ],
      })

      expect(getBreadcrumbItems(metadata)).toEqual([
        crumb(1, 'Home', 'https://l2beat.com/'),
        crumb(2, 'Layer 2s', 'https://l2beat.com/layer2s/summary'),
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

  // The manifest fingerprints URLs like the production build does, which
  // proves the image points at the served asset rather than its source path.
  it('hands page builders the URL, description and image of the meta tags', () => {
    const fingerprinting: Manifest = {
      ...manifest,
      getUrl: (url) => url.replace('.png', '-abc123.png'),
    }
    const pages: StructuredDataPage[] = []

    getMetadata(fingerprinting, {
      name: 'Glossary',
      description: 'Terms explained.',
      url: '/glossary?term=air',
      openGraph,
      structuredData: (page) => {
        pages.push(page)
        return []
      },
    })

    expect(pages).toEqual([
      {
        url: 'https://l2beat.com/glossary',
        description: 'Terms explained.',
        image: 'https://l2beat.com/meta-images/og-abc123.png',
      },
    ])
  })

  it('skips blocks a page builder has nothing to say for', () => {
    const metadata = getMetadata(manifest, {
      name: 'GRVT',
      url: '/layer2s/projects/grvt',
      openGraph,
      structuredData: () => [undefined],
    })

    expect(metadata.structuredData.map((data) => data['@type'])).toEqual([
      'BreadcrumbList',
    ])
  })

  it('keeps page-specific structured data after the breadcrumbs', () => {
    const metadata = getMetadata(manifest, {
      name: 'FAQ',
      url: '/faq',
      openGraph,
      structuredData: () => [{ '@type': 'FAQPage' }],
    })

    expect(metadata.structuredData.map((data) => data['@type'])).toEqual([
      'BreadcrumbList',
      'FAQPage',
    ])
  })

  it('emits no structured data on pages hidden from search engines', () => {
    const metadata = getMetadata(manifest, {
      name: 'Page not found',
      url: '/nonexistent',
      openGraph,
      excludeFromSearchEngines: true,
      structuredData: () => [{ '@type': 'Thing' }],
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

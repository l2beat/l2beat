import { expect } from 'earl'
import { getCollectionEntry } from '~/content/getCollection'
import type { Manifest } from '~/utils/Manifest'
import {
  getMonthlyUpdateArticleStructuredData,
  getPublicationArticleStructuredData,
} from './getArticleStructuredData'

// Runs against real publications so the test also guards what ships. The
// manifest fingerprints URLs like the production build does, which proves
// the image points at the served asset rather than its source path.
describe('Article structured data', () => {
  const manifest: Manifest = {
    getUrl: (url) => url.replace('.png', '-abc123.png'),
    getImage: (url) => ({ src: url, width: 1, height: 1 }),
  }
  const l2beat = {
    '@type': 'Organization',
    '@id': 'https://l2beat.com/#organization',
    name: 'L2BEAT',
    url: 'https://l2beat.com',
    logo: 'https://l2beat.com/logo.png',
  }

  describe(getPublicationArticleStructuredData.name, () => {
    it('describes a governance post as an Article by its author', () => {
      const post = getCollectionEntry(
        'governance-publications',
        'governance-review-1',
      )
      if (!post) throw new Error('governance-review-1 is missing')

      expect(getPublicationArticleStructuredData(manifest, post)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': 'https://l2beat.com/publications/governance-review-1',
        url: 'https://l2beat.com/publications/governance-review-1',
        mainEntityOfPage: 'https://l2beat.com/publications/governance-review-1',
        headline: 'Governance Review #01',
        description:
          'L2BEAT provides weekly updates on governance in concise articles.',
        image:
          'https://l2beat.com/meta-images/publications/governance-review-1-abc123.png',
        datePublished: '2024-01-19',
        author: {
          '@type': 'Person',
          name: 'Anastassis Oikonomopoulos',
          jobTitle: 'Governance Representative',
        },
        publisher: l2beat,
      })
    })
  })

  describe(getMonthlyUpdateArticleStructuredData.name, () => {
    it('credits L2BEAT, as monthly updates have no single author', () => {
      const update = getCollectionEntry(
        'monthly-updates',
        'monthly-update-2025-07',
      )
      if (!update) throw new Error('monthly-update-2025-07 is missing')

      expect(getMonthlyUpdateArticleStructuredData(manifest, update)).toEqual(
        expect.subset({
          '@type': 'Article',
          headline: 'Monthly Updates - July 2025',
          datePublished: '2025-08-01',
          author: l2beat,
          publisher: l2beat,
        }),
      )
    })
  })
})

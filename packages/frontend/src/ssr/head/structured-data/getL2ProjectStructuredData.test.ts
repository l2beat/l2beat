import { expect } from 'earl'
import { getL2ProjectStructuredData } from './getL2ProjectStructuredData'

// Feeds a hand-written project and compares against the literal Dataset a
// crawler should see, then drops one input at a time to check what it gates.
describe(getL2ProjectStructuredData.name, () => {
  const arbitrum = {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    display: { description: 'Arbitrum One is an Optimistic Rollup.' },
    hasTvsApi: true,
    hasActivityApi: true,
  }

  it('describes the project page as a Dataset served by the JSON API', () => {
    expect(getL2ProjectStructuredData(arbitrum)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': 'https://l2beat.com/layer2s/projects/arbitrum',
      url: 'https://l2beat.com/layer2s/projects/arbitrum',
      name: 'Arbitrum One',
      description:
        'Explore Arbitrum One metrics and in-depth research. Arbitrum One is an Optimistic Rollup.',
      isAccessibleForFree: true,
      creator: {
        '@type': 'Organization',
        '@id': 'https://l2beat.com/#organization',
        name: 'L2BEAT',
        url: 'https://l2beat.com',
        logo: 'https://l2beat.com/logo.png',
      },
      distribution: [
        {
          '@type': 'DataDownload',
          name: 'Arbitrum One Total Value Secured',
          encodingFormat: 'application/json',
          contentUrl: 'https://l2beat.com/api/scaling/tvs/arbitrum',
        },
        {
          '@type': 'DataDownload',
          name: 'Arbitrum One Activity',
          encodingFormat: 'application/json',
          contentUrl: 'https://l2beat.com/api/scaling/activity/arbitrum',
        },
      ],
    })
  })

  it('links only the APIs that serve the project', () => {
    const dataset = getL2ProjectStructuredData({
      ...arbitrum,
      hasTvsApi: false,
    })

    expect(dataset.distribution.map((d) => d.contentUrl)).toEqual([
      'https://l2beat.com/api/scaling/activity/arbitrum',
    ])
  })
})

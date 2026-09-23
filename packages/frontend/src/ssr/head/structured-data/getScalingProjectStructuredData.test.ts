import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getScalingProjectStructuredData } from './getScalingProjectStructuredData'

// Feeds a hand-written project and compares against the literal Dataset a
// crawler should see, then drops one input at a time to check what it gates.
describe(getScalingProjectStructuredData.name, () => {
  const arbitrum = {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    display: { description: 'Arbitrum One is an Optimistic Rollup.' },
    discoveryInfo: { baseTimestamp: UnixTime(1758499200) },
    hasTvsApi: true,
    hasActivityApi: true,
  }

  it('describes the project page as a Dataset served by the JSON API', () => {
    expect(getScalingProjectStructuredData(arbitrum)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': 'https://l2beat.com/layer2s/projects/arbitrum',
      url: 'https://l2beat.com/layer2s/projects/arbitrum',
      name: 'Arbitrum One',
      description:
        'Explore Arbitrum One metrics and in-depth research. Arbitrum One is an Optimistic Rollup.',
      dateModified: '2025-09-22T00:00:00.000Z',
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
    const dataset = getScalingProjectStructuredData({
      ...arbitrum,
      hasTvsApi: false,
    })

    expect(dataset.distribution.map((d) => d.contentUrl)).toEqual([
      'https://l2beat.com/api/scaling/activity/arbitrum',
    ])
  })

  it('leaves dateModified out when the project was never discovered', () => {
    const { discoveryInfo: _, ...undiscovered } = arbitrum

    const dataset = getScalingProjectStructuredData(undiscovered)

    expect(Object.keys(dataset)).not.toInclude('dateModified')
  })
})

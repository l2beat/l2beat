import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getScalingProjectStructuredData } from './getScalingProjectStructuredData'

describe(getScalingProjectStructuredData.name, () => {
  const arbitrum = {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    display: { description: 'Arbitrum One is an Optimistic Rollup.' },
    discoveryInfo: { baseTimestamp: UnixTime(1758499200) },
    tvsConfig: [],
    activityConfig: { type: 'block' },
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
    const { tvsConfig: _, ...withoutTvs } = arbitrum

    const dataset = getScalingProjectStructuredData(withoutTvs)

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

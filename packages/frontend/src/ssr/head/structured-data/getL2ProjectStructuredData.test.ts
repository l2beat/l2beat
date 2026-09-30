import { expect } from 'earl'
import {
  getL2ProjectStructuredData,
  getL2ProjectTvsBreakdownStructuredData,
} from './getL2ProjectStructuredData'

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

    expect(dataset?.distribution.map((d) => d.contentUrl)).toEqual([
      'https://l2beat.com/api/scaling/activity/arbitrum',
    ])
  })

  it('emits no Dataset for a project without any API', () => {
    const dataset = getL2ProjectStructuredData({
      ...arbitrum,
      hasTvsApi: false,
      hasActivityApi: false,
    })

    expect(dataset).toEqual(undefined)
  })
})

// Same method: a hand-written project in, the literal Dataset out. The page
// has one machine-readable source, the breakdown endpoint of the public API.
describe(getL2ProjectTvsBreakdownStructuredData.name, () => {
  it('describes the breakdown page as a Dataset served by the breakdown API', () => {
    const dataset = getL2ProjectTvsBreakdownStructuredData(
      { name: 'Arbitrum One', slug: 'arbitrum' },
      "See a detailed breakdown of Arbitrum One's TVS on L2BEAT.",
    )

    expect(dataset).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': 'https://l2beat.com/layer2s/projects/arbitrum/tvs-breakdown',
      url: 'https://l2beat.com/layer2s/projects/arbitrum/tvs-breakdown',
      name: 'Arbitrum One TVS Breakdown',
      description: "See a detailed breakdown of Arbitrum One's TVS on L2BEAT.",
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
          name: 'Arbitrum One TVS Breakdown',
          encodingFormat: 'application/json',
          contentUrl: 'https://l2beat.com/api/scaling/tvs/arbitrum/breakdown',
        },
      ],
    })
  })
})

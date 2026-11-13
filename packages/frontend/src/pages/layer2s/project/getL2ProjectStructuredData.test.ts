import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getL2ProjectStructuredData,
  getL2ProjectTvsBreakdownStructuredData,
} from './getL2ProjectStructuredData'

const l2beat = {
  '@type': 'Organization' as const,
  '@id': 'https://ethbeat.org/#organization',
  name: 'ETHBEAT',
  url: 'https://ethbeat.org',
  logo: 'https://ethbeat.org/logo.png',
}

// Feeds the page getMetadata would resolve plus a hand-written project and
// compares against the literal Dataset a crawler should see, then drops one
// input at a time to check what it gates.
describe(getL2ProjectStructuredData.name, () => {
  const page = {
    url: 'https://ethbeat.org/layer2s/projects/arbitrum',
    description:
      'Explore Arbitrum One metrics and in-depth research. Arbitrum One is an Optimistic Rollup.',
    image: 'https://ethbeat.org/og.png',
  }
  const arbitrum = {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    archivedAt: undefined,
    hasTvsApi: true,
    hasActivityApi: true,
  }

  it('describes the project page as a Dataset served by the JSON API', () => {
    expect(getL2ProjectStructuredData(page, arbitrum)).toEqual({
      '@type': 'Dataset',
      '@id': 'https://ethbeat.org/layer2s/projects/arbitrum',
      url: 'https://ethbeat.org/layer2s/projects/arbitrum',
      name: 'Arbitrum One',
      description:
        'Explore Arbitrum One metrics and in-depth research. Arbitrum One is an Optimistic Rollup.',
      isAccessibleForFree: true,
      creator: l2beat,
      distribution: [
        {
          '@type': 'DataDownload',
          name: 'Arbitrum One Total Value Secured',
          encodingFormat: 'application/json',
          contentUrl: 'https://ethbeat.org/api/scaling/tvs/arbitrum',
        },
        {
          '@type': 'DataDownload',
          name: 'Arbitrum One Activity',
          encodingFormat: 'application/json',
          contentUrl: 'https://ethbeat.org/api/scaling/activity/arbitrum',
        },
      ],
    })
  })

  it('links only the APIs that serve the project', () => {
    const dataset = getL2ProjectStructuredData(page, {
      ...arbitrum,
      hasTvsApi: false,
    })

    expect(dataset?.distribution.map((d) => d.contentUrl)).toEqual([
      'https://ethbeat.org/api/scaling/activity/arbitrum',
    ])
  })

  it('asks for the full range of an archived project, whose last 30d are empty', () => {
    const dataset = getL2ProjectStructuredData(page, {
      ...arbitrum,
      archivedAt: UnixTime(1_700_000_000),
    })

    expect(dataset?.distribution.map((d) => d.contentUrl)).toEqual([
      'https://ethbeat.org/api/scaling/tvs/arbitrum?range=max',
      'https://ethbeat.org/api/scaling/activity/arbitrum?range=max',
    ])
  })

  it('emits no Dataset for a project without any API', () => {
    const dataset = getL2ProjectStructuredData(page, {
      ...arbitrum,
      hasTvsApi: false,
      hasActivityApi: false,
    })

    expect(dataset).toEqual(undefined)
  })
})

// Same method: the resolved page and a hand-written project in, the literal
// Dataset out. The page has one machine-readable source, the breakdown
// endpoint of the public API.
describe(getL2ProjectTvsBreakdownStructuredData.name, () => {
  it('describes the breakdown page as a Dataset served by the breakdown API', () => {
    const dataset = getL2ProjectTvsBreakdownStructuredData(
      {
        url: 'https://ethbeat.org/layer2s/projects/arbitrum/tvs-breakdown',
        description:
          "See a detailed breakdown of Arbitrum One's TVS on ETHBEAT.",
        image: 'https://ethbeat.org/og.png',
      },
      { name: 'Arbitrum One', slug: 'arbitrum', archivedAt: undefined },
    )

    expect(dataset).toEqual({
      '@type': 'Dataset',
      '@id': 'https://ethbeat.org/layer2s/projects/arbitrum/tvs-breakdown',
      url: 'https://ethbeat.org/layer2s/projects/arbitrum/tvs-breakdown',
      name: 'Arbitrum One TVS breakdown',
      description: "See a detailed breakdown of Arbitrum One's TVS on ETHBEAT.",
      isAccessibleForFree: true,
      creator: l2beat,
      distribution: [
        {
          '@type': 'DataDownload',
          name: 'Arbitrum One TVS breakdown',
          encodingFormat: 'application/json',
          contentUrl: 'https://ethbeat.org/api/scaling/tvs/arbitrum/breakdown',
        },
      ],
    })
  })
})

import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLegacyPathsRouter } from './LegacyPathsRouter'

// Method: request legacy URLs without following redirects and check the
// permanent redirect target.
describe(createLegacyPathsRouter.name, () => {
  for (const [from, to] of [
    ['/data-availability', '/blobs'],
    ['/data-availability/summary', '/blobs'],
    ['/data-availability/projects/celestia/blobstream', '/blobs'],
    ['/data-availability/summary.md', '/blobs'],
    ['/da-risk-framework', '/blobs'],
    ['/data-availability/projects/xai/dac', '/projects/xai'],
    ['/project/arbitrum', '/projects/arbitrum'],
    [
      '/scaling/projects/arbitrum/tvl-breakdown',
      '/projects/arbitrum/tvs-breakdown',
    ],
    ['/data-availability/projects/ethereum/ethereum', '/projects/ethereum'],
    [
      '/data-availability/projects/ethereum/ethereum.md',
      '/projects/ethereum.md',
    ],
    ['/interop/tokens/9HN5PN/circle/usdc', '/tokens/9HN5PN/circle/usdc'],
    ['/interop/tokens/9HN5PN/circle/usdc.md', '/tokens/9HN5PN/circle/usdc.md'],
    [
      '/interop/tokens/9HN5PN/opengraph-image.png',
      '/tokens/9HN5PN/opengraph-image.png',
    ],
    ['/Interop/Tokens/9HN5PN', '/tokens/9HN5PN'],
    ['/ecosystems/superchain', '/layer2s/summary'],
    ['/ecosystems/agglayer.md', '/layer2s/summary'],
  ] as const) {
    it(`redirects ${from} to ${to}`, async () => {
      const response = await fetchFromRouter(createLegacyPathsRouter(), from, {
        redirect: 'manual',
      })

      expect(response.status).toEqual(301)
      expect(
        new URL(response.headers.get('location') ?? '', 'http://x').pathname,
      ).toEqual(to)
    })
  }

  // Not handled here, so the request reaches the page router behind it.
  for (const path of [
    '/projects/arbitrum',
    '/projects/arbitrum.md',
    '/projects/ethereum',
    '/projects/Ethereum/',
    '/projects/ethereum.md',
    '/projects/bsc',
    '/projects/solana',
  ]) {
    it(`leaves ${path} to the page router`, async () => {
      const response = await fetchFromRouter(createLegacyPathsRouter(), path, {
        redirect: 'manual',
      })

      expect(response.status).toEqual(404)
    })
  }
})

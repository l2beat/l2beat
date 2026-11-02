import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLegacyPathsRouter } from './LegacyPathsRouter'

// Method: request legacy URLs without following redirects and check the
// permanent redirect target, query included. Whether a bridge slug has an
// interop protocol comes from the real project database: "across" is one,
// "stargatev2" maps to one, and "nomad" has none.
describe(createLegacyPathsRouter.name, () => {
  for (const [from, to] of [
    ['/data-availability', '/blobs'],
    ['/data-availability/summary', '/blobs'],
    ['/data-availability/projects/celestia/blobstream', '/blobs'],
    ['/data-availability/summary.md', '/blobs'],
    ['/da-risk-framework', '/blobs'],
    ['/data-availability/projects/xai/dac', '/layer2s/projects/xai'],
    ['/data-availability/projects/ethereum/ethereum', '/projects/ethereum'],
    [
      '/data-availability/projects/ethereum/ethereum.md',
      '/projects/ethereum.md',
    ],
    ['/projects/arbitrum', '/layer2s/projects/arbitrum'],
    ['/projects/arbitrum.md', '/layer2s/projects/arbitrum.md'],
    // Renamed since: MigratedProjectsRouter takes it on to the current slug.
    ['/projects/zksync2', '/layer2s/projects/zksync2'],
    ['/interop/tokens/9HN5PN/circle/usdc', '/tokens/9HN5PN/circle/usdc'],
    ['/interop/tokens/9HN5PN/circle/usdc.md', '/tokens/9HN5PN/circle/usdc.md'],
    [
      '/interop/tokens/9HN5PN/opengraph-image.png',
      '/tokens/9HN5PN/opengraph-image.png',
    ],
    ['/Interop/Tokens/9HN5PN', '/tokens/9HN5PN'],
    ['/bridges', '/interop'],
    ['/bridges/summary', '/interop'],
    ['/bridges/projects/across', '/interop/protocols/across'],
    [
      '/bridges/projects/across/opengraph-image.png',
      '/interop/protocols/across',
    ],
    ['/bridges/projects/stargatev2', '/interop/protocols/stargate'],
    ['/bridges/projects/nomad', '/interop'],
    [
      '/bridges/projects/across?utm_source=x',
      '/interop/protocols/across?utm_source=x',
    ],
    ['/bridges/projects/nomad?utm_source=x', '/interop?utm_source=x'],
    ['/scaling?filter=rollups', '/layer2s/summary?filter=rollups'],
  ] as const) {
    it(`redirects ${from} to ${to}`, async () => {
      const response = await fetchFromRouter(createLegacyPathsRouter(), from, {
        redirect: 'manual',
      })

      expect(response.status).toEqual(301)
      expect(locationPath(response)).toEqual(to)
    })
  }

  // Not handled here, so the request reaches the page router behind it.
  for (const path of [
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

function locationPath(response: Response) {
  const { pathname, search } = new URL(
    response.headers.get('location') ?? '',
    'http://x',
  )
  return pathname + search
}

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
    ['/data-availability/projects/xai/dac', '/layer2s/projects/xai'],
    ['/data-availability/projects/ethereum', '/projects/ethereum'],
    ['/data-availability/projects/ethereum/no-bridge', '/projects/ethereum'],
    ['/data-availability/projects/ethereum/ethereum', '/projects/ethereum'],
    [
      '/data-availability/projects/ethereum/ethereum.md',
      '/projects/ethereum.md',
    ],
    ['/projects/arbitrum', '/layer2s/projects/arbitrum'],
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
    '/projects/ethereum',
    '/projects/Ethereum/',
    '/projects/ethereum.md',
  ]) {
    it(`leaves ${path} to the page router`, async () => {
      const response = await fetchFromRouter(createLegacyPathsRouter(), path, {
        redirect: 'manual',
      })

      expect(response.status).toEqual(404)
    })
  }
})

import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createLegacyPathsRouter } from './LegacyPathsRouter'

// Method: request URLs of the removed data availability pages without
// following redirects and check the permanent redirect target.
describe(createLegacyPathsRouter.name, () => {
  for (const [from, to] of [
    ['/data-availability', '/blobs'],
    ['/data-availability/summary', '/blobs'],
    ['/data-availability/projects/celestia/blobstream', '/blobs'],
    ['/data-availability/summary.md', '/blobs'],
    ['/da-risk-framework', '/blobs'],
    ['/data-availability/projects/xai/dac', '/layer2s/projects/xai'],
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
})

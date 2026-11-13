import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createMigratedProjectsRouter } from './MigratedProjectsRouter'

// Method: request old project URLs without following redirects and check the
// permanent redirect target, for the HTML page and each of its variants.
describe(createMigratedProjectsRouter.name, () => {
  for (const [from, to] of [
    ['/layer2s/projects/zksync2', '/projects/zksync-era'],
    ['/layer2s/projects/zksync2.md', '/projects/zksync-era.md'],
    [
      '/layer2s/projects/zksync2/tvs-breakdown',
      '/projects/zksync-era/tvs-breakdown',
    ],
    // Redirected to the L2 URL above for years, so browsers may hold that.
    ['/projects/zksync2', '/projects/zksync-era'],
    ['/projects/zksync2.md', '/projects/zksync-era.md'],
  ] as const) {
    it(`redirects ${from} to ${to}`, async () => {
      const response = await fetchFromRouter(
        createMigratedProjectsRouter(),
        from,
        { redirect: 'manual' },
      )

      expect(response.status).toEqual(301)
      expect(
        new URL(response.headers.get('location') ?? '', 'http://x').pathname,
      ).toEqual(to)
    })
  }
})

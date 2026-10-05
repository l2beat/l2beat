import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createMigratedProjectsRouter } from './MigratedProjectsRouter'

// Method: request old project URLs without following redirects and check the
// permanent redirect target, for the HTML page and each of its variants.
describe(createMigratedProjectsRouter.name, () => {
  for (const [from, to] of [
    ['/layer2s/projects/zksync2', '/layer2s/projects/zksync-era'],
    ['/layer2s/projects/zksync2.md', '/layer2s/projects/zksync-era.md'],
    [
      '/layer2s/projects/zksync2/tvs-breakdown',
      '/layer2s/projects/zksync-era/tvs-breakdown',
    ],
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

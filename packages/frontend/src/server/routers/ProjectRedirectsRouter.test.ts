import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createProjectRedirectsRouter } from './ProjectRedirectsRouter'

// Method: request the section URLs project pages had, without following
// redirects, and check where the permanent redirect sends them. Which slugs
// have a page comes from the real project database.
describe(createProjectRedirectsRouter.name, () => {
  for (const [from, to] of [
    // Browsers may hold the old 301 from /projects/{slug} to these, so the
    // target is a URL none of them has cached.
    ['/layer2s/projects/arbitrum', '/projects/arbitrum?migration=1'],
    ['/layer2s/projects/arbitrum.md', '/projects/arbitrum.md?migration=1'],
    // That old redirect sent every slug there, not only scaling ones.
    ['/layer2s/projects/railgun', '/projects/railgun?migration=1'],
    [
      '/layer2s/projects/arbitrum?update=abc',
      '/projects/arbitrum?update=abc&migration=1',
    ],
    [
      '/layer2s/projects/arbitrum/tvs-breakdown',
      '/projects/arbitrum/tvs-breakdown',
    ],
    ['/privacy/projects/railgun', '/projects/railgun'],
    ['/privacy/projects/railgun.md', '/projects/railgun.md'],
    ['/zk-catalog/sp1turbo', '/projects/sp1turbo'],
    ['/interop/protocols/across?update=abc', '/projects/across?update=abc'],
    ['/interop/protocols/arbitrum.md', '/projects/arbitrum.md'],
    // A scaling project's canonical bridge shows on its page.
    [
      '/interop/protocols/arbitrum',
      '/projects/arbitrum?protocols=arbitrum#interop-flows',
    ],
  ] as const) {
    it(`redirects ${from} to ${to}`, async () => {
      const response = await fetchFromRouter(
        createProjectRedirectsRouter(),
        from,
        { redirect: 'manual' },
      )

      expect(response.status).toEqual(301)
      const location = new URL(
        response.headers.get('location') ?? '',
        'http://x',
      )
      expect(location.pathname + location.search + location.hash).toEqual(to)
    })
  }

  // Not a project: the request goes on to the 404 page.
  for (const path of ['/layer2s/projects/unknown', '/zk-catalog/unknown']) {
    it(`leaves ${path} to the routers behind it`, async () => {
      const response = await fetchFromRouter(
        createProjectRedirectsRouter(),
        path,
        { redirect: 'manual' },
      )

      expect(response.status).toEqual(404)
    })
  }
})

import { expect, mockObject } from 'earl'
import type express from 'express'
import { PROJECT_PAGES_WITH_MARKDOWN } from '~/utils/getMarkdownAlternatePath'
import type { Manifest } from '~/utils/Manifest'
import { createServerPageRouter } from './ServerPageRouter'

// Method: build the real page router (no request is made, so nothing is
// rendered or fetched) and walk its route table for paths ending in `.md`.
// They must be exactly the registered patterns: a markdown route that is not
// registered is served but never advertised, a registered pattern without a
// route advertises a 404.
describe(createServerPageRouter.name, () => {
  it('serves markdown for exactly the project pages registered as having it', () => {
    const router = createServerPageRouter(
      mockObject<Manifest>({}),
      async () => '<html />',
    )

    const served = getRoutePaths(router).filter((path) => path.endsWith('.md'))
    const registered = PROJECT_PAGES_WITH_MARKDOWN.map((page) => `${page}.md`)

    expect(served.toSorted()).toEqual(registered.toSorted())
  })
})

/** Page routers are mounted as sub-routers, so routes sit one level below the top. */
function getRoutePaths(router: express.Router): string[] {
  return router.stack.flatMap((layer) => {
    if (layer.route) return [String(layer.route.path)]
    const mounted = layer.handle as Partial<express.Router>
    return mounted.stack ? getRoutePaths(mounted as express.Router) : []
  })
}

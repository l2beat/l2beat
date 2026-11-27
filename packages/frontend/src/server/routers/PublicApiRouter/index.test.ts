import { expect } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createPublicApiRouter } from '.'

// Why: scripts still call the old API after its shutdown. The answer has to
// say it is gone for good and where the new API is, for every old path.
// Method: request old paths over HTTP from the real router and read the
// status, headers and body.
describe(createPublicApiRouter.name, () => {
  const OLD_PATHS = [
    '/api/scaling/summary',
    '/api/scaling/tvs',
    '/api/scaling/tvs/arbitrum?range=max',
    '/api/scaling/tvs/arbitrum/breakdown',
    '/api/scaling/activity',
    '/api/scaling/activity/arbitrum',
  ]

  it('answers 410 with a pointer to the new API on every old path', async () => {
    for (const path of OLD_PATHS) {
      const response = await fetchFromRouter(createPublicApiRouter(), path)

      expect(response.status).toEqual(410)
      expect(await response.json()).toEqual({
        success: false,
        error:
          'This API was shut down on 2026-12-15T00:00:00.000Z. Use https://api.ethbeat.org instead: see https://ethbeat.org/api-migration',
        sunset: '2026-12-15T00:00:00.000Z',
        migrationGuide: 'https://ethbeat.org/api-migration',
        newApi: 'https://api.ethbeat.org',
      })
    }
  })

  it('lets the edge cache the answer and links the guide and the new API', async () => {
    const response = await fetchFromRouter(
      createPublicApiRouter(),
      '/api/scaling/summary',
    )

    expect(response.headers.get('cache-control')).toEqual(
      'public, max-age=3600, s-maxage=86400',
    )
    expect(response.headers.get('link')).toEqual(
      '<https://ethbeat.org/api-migration>; rel="sunset"; type="text/html", <https://api.ethbeat.org>; rel="successor-version"',
    )
  })

  it('leaves the rest of /api to the other routers', async () => {
    // Nothing else is mounted here, so falling through shows up as a 404.
    const response = await fetchFromRouter(
      createPublicApiRouter(),
      '/api/trpc/tvs.table',
    )

    expect(response.status).toEqual(404)
  })
})

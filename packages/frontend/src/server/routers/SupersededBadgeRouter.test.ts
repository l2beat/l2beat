import { expect, mockObject } from 'earl'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createSupersededBadgeRouter } from './SupersededBadgeRouter'

// Method: serve the router over HTTP with a manifest that knows one badge,
// and read the status and Location the browser would follow.
describe(createSupersededBadgeRouter.name, () => {
  const manifest = mockObject<Manifest>({
    getUrl: (path: string) => {
      if (path === '/images/garden/badges/crops-tag-light.svg') {
        return '/static/images/garden/badges/crops-tag-light.0a1b2c3d.svg'
      }
      throw new Error('Trying to access non existing file in manifest')
    },
  })
  const router = createSupersededBadgeRouter(manifest)

  it('redirects a superseded hash to the current badge file', async () => {
    const response = await fetchFromRouter(
      router,
      '/static/images/garden/badges/crops-tag-light.deadbeef.svg',
      { redirect: 'manual' },
    )

    expect(response.status).toEqual(301)
    expect(response.headers.get('location')).toEqual(
      '/static/images/garden/badges/crops-tag-light.0a1b2c3d.svg',
    )
  })

  it('leaves the current hash to the static files', async () => {
    const response = await fetchFromRouter(
      router,
      '/static/images/garden/badges/crops-tag-light.0a1b2c3d.svg',
      { redirect: 'manual' },
    )

    expect(response.status).toEqual(404)
  })

  it('leaves badges the build no longer has as a 404', async () => {
    const response = await fetchFromRouter(
      router,
      '/static/images/garden/badges/crops-ribbon-light.deadbeef.svg',
      { redirect: 'manual' },
    )

    expect(response.status).toEqual(404)
  })

  it('ignores other hashed assets', async () => {
    const response = await fetchFromRouter(
      router,
      '/static/images/other/crops-tag-light.deadbeef.svg',
      { redirect: 'manual' },
    )

    expect(response.status).toEqual(404)
  })
})

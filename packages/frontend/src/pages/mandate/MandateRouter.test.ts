import { expect, mockObject } from 'earl'
import { env } from '~/env'
import type { RenderData } from '~/ssr/types'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createMandateRouter } from './MandateRouter'

// Method: mount the real router with a render function that records what it
// was asked to render, under the flag as production and as every other
// deployment sets it.
describe(createMandateRouter.name, () => {
  const originalEnabled = env.CLIENT_SIDE_MANDATE_PAGE

  after(() => {
    env.CLIENT_SIDE_MANDATE_PAGE = originalEnabled
  })

  it('is not mounted when the flag is off, as on production', () => {
    env.CLIENT_SIDE_MANDATE_PAGE = false

    expect(createMandateRouter(manifest, async () => '<html />')).toEqual(null)
  })

  it('renders the mandate page when the flag is on', async () => {
    env.CLIENT_SIDE_MANDATE_PAGE = true
    const rendered: RenderData[] = []
    const router = createMandateRouter(manifest, async (data) => {
      rendered.push(data)
      return '<html />'
    })
    if (!router) throw new Error('Mandate router is disabled')

    const response = await fetchFromRouter(router, '/mandate')

    expect(response.status).toEqual(200)
    expect(await response.text()).toEqual('<html />')
    expect(rendered.map((data) => data.ssr.page)).toEqual(['MandatePage'])
  })
})

const manifest = mockObject<Manifest>({ getUrl: (path: string) => path })

import { expect, mockObject } from 'earl'
import type { RenderData } from '~/ssr/types'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createMandateRouter } from './MandateRouter'

// Method: mount the real router with a render function that records what it
// was asked to render.
describe(createMandateRouter.name, () => {
  it('renders the mandate page', async () => {
    const rendered: RenderData[] = []
    const router = createMandateRouter(manifest, async (data) => {
      rendered.push(data)
      return '<html />'
    })

    const response = await fetchFromRouter(router, '/mandate')

    expect(response.status).toEqual(200)
    expect(await response.text()).toEqual('<html />')
    expect(rendered.map((data) => data.ssr.page)).toEqual(['MandatePage'])
  })
})

const manifest = mockObject<Manifest>({ getUrl: (path: string) => path })

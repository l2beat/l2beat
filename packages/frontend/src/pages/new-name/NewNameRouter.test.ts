import { expect, mockObject } from 'earl'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import type { RenderData } from '~/ssr/types'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { createNewNameRouter } from './NewNameRouter'

describe(createNewNameRouter.name, () => {
  it('renders the announcement', async () => {
    const rendered: RenderData[] = []
    const router = createNewNameRouter(manifest, async (data) => {
      rendered.push(data)
      return '<html />'
    })

    const response = await fetchFromRouter(router, RENAME_ANNOUNCEMENT_PATH)

    expect(response.status).toEqual(200)
    expect(rendered.map((data) => data.ssr.page)).toEqual(['NewNamePage'])
    expect(rendered[0]?.head.metadata.title).toEqual(
      'L2BEAT is now ETHBEAT - ETHBEAT',
    )
  })
})

const manifest = mockObject<Manifest>({ getUrl: (path: string) => path })

import { expect, mockObject } from 'earl'
import express from 'express'
import { LlmsLinkHeaderMiddleware } from '~/server/middlewares/LlmsLinkHeaderMiddleware'
import type { RenderData } from '~/ssr/types'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import type { Manifest } from '~/utils/Manifest'
import { sendNotFoundPage } from './sendNotFoundPage'

// Method: mount the Link header middleware the way the server does, then a
// project route that finds nothing and answers with the 404 page. The render
// function echoes the head metadata, so both places an alternate is
// advertised (the Link header and the <head> link) are read over HTTP.
describe(sendNotFoundPage.name, () => {
  it('advertises no markdown alternate for a page that does not exist', async () => {
    const response = await fetchFromRouter(
      createRouter(),
      '/layer2s/projects/doesnotexist',
    )

    expect(response.status).toEqual(404)
    expect(response.headers.get('link')).toEqual(
      '<https://l2beat.com/llms.txt>; rel="describedby"',
    )
    const metadata = JSON.parse(await response.text())
    expect(metadata.markdownAlternateUrl).toEqual(undefined)
  })
})

function createRouter() {
  const manifest = mockObject<Manifest>({ getUrl: (path: string) => path })
  const renderMetadata = async (data: RenderData) =>
    JSON.stringify(data.head.metadata)

  const router = express.Router()
  router.use(LlmsLinkHeaderMiddleware())
  router.get('/layer2s/projects/:slug', async (req, res) => {
    await sendNotFoundPage(manifest, renderMetadata, req.originalUrl, res)
  })
  return router
}

import express from 'express'
import { sendPage } from '~/server/utils/sendPage'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getAboutUsData } from './getAboutUsData'

export function createAboutUsRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/about-us', async (req, res) => {
    const data = await getAboutUsData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    sendPage(res, html)
  })

  return router
}

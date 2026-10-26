import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getMandateData } from './getMandateData'

export function createMandateRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  if (!env.CLIENT_SIDE_MANDATE_PAGE) return null
  const router = express.Router()

  router.get('/mandate', async (req, res) => {
    const data = await getMandateData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

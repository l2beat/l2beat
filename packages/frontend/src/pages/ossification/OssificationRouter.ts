import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getOssificationData } from './getOssificationData'

export function createOssificationRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  if (!env.CLIENT_SIDE_OSSIFICATION_ENABLED) {
    return null
  }

  const router = express.Router()

  router.get('/ossification', async (req, res) => {
    const data = await getOssificationData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

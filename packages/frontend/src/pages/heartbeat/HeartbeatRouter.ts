import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getHeartbeatPageData } from './getHeartbeatPageData'

export function createHeartbeatRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  if (!env.CLIENT_SIDE_HEARTBEAT_PAGE) return null
  const router = express.Router()

  router.get('/layer2s/activity/live', async (req, res) => {
    const data = await getHeartbeatPageData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

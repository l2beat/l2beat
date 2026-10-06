import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getActivityPlaygroundData } from './activity/getActivityPlaygroundData'
import { getIconPreviewData } from './icons/getIconPreviewData'

export function createDevRouter(manifest: Manifest, render: RenderFunction) {
  if (env.NODE_ENV !== 'development') {
    return
  }

  const router = express.Router()

  router.get('/dev/icons', async (req, res) => {
    const data = await getIconPreviewData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/dev/activity', async (req, res) => {
    const data = await getActivityPlaygroundData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getPublicationsData } from './getPublicationsData'

export function createPublicationsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/publications', async (req, res) => {
    const data = await getPublicationsData(manifest, req.originalUrl)

    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

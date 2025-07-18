import { v } from '@l2beat/validate'
import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getZkCatalogV1Data } from './v1/getZkCatalogV1Data'
import { getZkCatalogProjectData } from './v1/project/getZkCatalogProjectData'
import { getZkCatalogData } from './v2/getZkCatalogData'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const data = await getZkCatalogData(manifest, req.originalUrl, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/zk-catalog/v1', async (req, res) => {
    const data = await cache.get(
      { key: ['zk-catalog', 'v1'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getZkCatalogV1Data(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/zk-catalog/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['zk-catalog', 'v1', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getZkCatalogProjectData(manifest, req.params.slug, req.originalUrl),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

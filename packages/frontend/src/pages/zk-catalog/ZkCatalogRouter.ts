import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getZkCatalogData } from './v2/getZkCatalogData'
import { getZkCatalogProjectData } from './v2/project/getZkCatalogProjectData'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const data = await getZkCatalogData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
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
          key: ['zk-catalog', 'v2', 'projects', req.params.slug],
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
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

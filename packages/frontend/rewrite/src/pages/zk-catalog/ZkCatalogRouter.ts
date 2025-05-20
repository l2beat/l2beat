import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { DataCache } from '../../server/utils/DataCache'
import { getZkCatalogData } from './getZkCatalogData'
import { getZkCatalogProjectData } from './project/getZkCatalogProjectData'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: DataCache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const data = await cache.getData({ key: '/zk-catalog', ttl: 60 * 10 }, () =>
      getZkCatalogData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/zk-catalog/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await cache.getData(
        { key: `/zk-catalog/projects/${req.params.slug}`, ttl: 60 * 10 },
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

import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { z } from 'zod'
import type { ICache } from '~/server/cache/ICache'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getZkCatalogData } from './getZkCatalogData'
import { getZkCatalogProjectData } from './project/getZkCatalogProjectData'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const data = await cache.get(
      { key: ['zk-catalog'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getZkCatalogData(manifest, req.originalUrl),
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
      const data = await cache.get(
        {
          key: ['zk-catalog', 'projects', req.params.slug],
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

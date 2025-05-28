import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '~/utils/Manifest'
import { getBridgesArchivedData } from './archived/getBridgesArchivedData'
import { getBridgesProjectData } from './project/getBridgesProjectData'
import { getBridgesSummaryData } from './summary/getBridgesSummaryData'
export function createBridgesRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/bridges', async (req, res) => {
    res.redirect('/bridges/summary')
  })

  router.get('/bridges/summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['bridges', 'summary'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getBridgesSummaryData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/bridges/archived', async (req, res) => {
    const data = await cache.get(
      {
        key: ['bridges', 'archived'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getBridgesArchivedData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/bridges/projects/:slug',
    validateRoute({
      params: z.object({
        slug: z.string(),
      }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['bridges', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getBridgesProjectData(manifest, req.params.slug, req.originalUrl),
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

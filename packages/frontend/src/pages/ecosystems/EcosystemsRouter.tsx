import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { z } from 'zod'
import { env } from '~/env'
import type { ICache } from '~/server/cache/ICache'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getEcosystemProjectData } from './project/getEcosystemProjectData'

export function createEcosystemsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get(
    '/ecosystems/:slug',
    validateRoute({
      params: z.object({
        slug: z.string(),
      }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['ecosystems', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getEcosystemProjectData(manifest, req.params.slug, req.originalUrl),
      )
      if (!data || !env.NEXT_PUBLIC_ECOSYSTEMS) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

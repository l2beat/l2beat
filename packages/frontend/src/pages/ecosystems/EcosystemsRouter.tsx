import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getEcosystemProjectData } from './project/getEcosystemProjectData'

export function createEcosystemsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get(
    '/ecosystems/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await getEcosystemProjectData(req, manifest, cache)
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

import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import { getChainProjectData } from './getChainProjectData'
import { CHAIN_PROJECT_PATH } from './paths'

export function createChainProjectRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get(
    CHAIN_PROJECT_PATH,
    validateRoute({ params: v.object({ slug: v.string() }) }),
    async (req, res) => {
      const data = await getChainProjectData(manifest, req.params.slug, cache)
      if (!data) {
        await sendNotFoundPage(manifest, render, req.originalUrl, res)
        return
      }
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

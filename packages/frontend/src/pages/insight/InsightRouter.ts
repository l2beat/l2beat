import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getInsightPageData } from './getInsightPageData'

export function createInsightRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  if (!env.CLIENT_SIDE_INSIGHT_PAGE) return null
  const router = express.Router()

  // The page is a shell: the report is fetched by the browser, so neither
  // route waits for the RPC and both are safe to edge-cache.
  router.get('/insight', async (req, res) => {
    const data = getInsightPageData(manifest, req.originalUrl, undefined)
    res.status(200).send(await render(await data, req.originalUrl))
  })

  router.get('/insight/:holder', async (req, res) => {
    const data = getInsightPageData(
      manifest,
      req.originalUrl,
      req.params.holder,
    )
    res.status(200).send(await render(await data, req.originalUrl))
  })

  return router
}

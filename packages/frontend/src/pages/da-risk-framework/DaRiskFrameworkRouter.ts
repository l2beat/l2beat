import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getDaRiskFrameworkData } from './getDaRiskFrameworkData'

export function createDaRiskFrameworkRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/da-risk-framework', async (req, res) => {
    const data = getDaRiskFrameworkData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

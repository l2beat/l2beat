import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getDaRiskFrameworkData } from './getDaRiskFrameworkData'

export function createDaRiskFrameworkRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/', (req, res) => {
    const data = getDaRiskFrameworkData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

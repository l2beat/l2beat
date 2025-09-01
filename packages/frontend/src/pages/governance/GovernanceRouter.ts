import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getGovernanceData } from './GetGovernanceData'

export function createGovernanceRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/governance', async (req, res) => {
    const data = await getGovernanceData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

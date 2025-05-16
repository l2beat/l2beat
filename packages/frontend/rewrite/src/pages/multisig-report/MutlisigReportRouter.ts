import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getMultisigReportData } from './getMultisigReportData'

export function createMutlisigReportRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/', async (req, res) => {
    const data = await getMultisigReportData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

import express from 'express'
import { sendPage } from '~/server/utils/sendPage'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getMultisigReportData } from './getMultisigReportData'

export function createMultisigReportRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/multisig-report', async (req, res) => {
    const data = await getMultisigReportData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    sendPage(res, html)
  })

  return router
}

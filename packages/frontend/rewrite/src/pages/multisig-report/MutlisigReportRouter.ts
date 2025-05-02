import type { Router } from 'express'

import type { RenderFunction } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'
import { getMultisigReportData } from './getMultisigReportData'

export function MutlisigReportRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/multisig-report', async (req, res) => {
    const data = await getMultisigReportData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

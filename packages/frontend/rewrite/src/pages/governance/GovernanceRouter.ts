import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getGovernanceData } from './getGovernanceData'

export function GovernanceRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/governance', async (req, res) => {
    const data = await getGovernanceData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

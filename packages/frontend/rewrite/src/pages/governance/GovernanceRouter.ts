import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getGovernanceData } from './getGovernanceData'
import { getGovernancePublicationData } from './publications/:id/getGovernancePublicationData'
import { getGovernancePublicationsData } from './publications/getGovernancePublicationsData'

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

  app.get('/governance/publications', async (req, res) => {
    const data = await getGovernancePublicationsData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/governance/publications/:id', async (req, res) => {
    const data = await getGovernancePublicationData(manifest, req.params.id)
    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

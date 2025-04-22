import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getZkCatalogData } from './getZkCatalogData'
import { getZkCatalogProjectData } from './project/getZkCatalogProjectData'

export function ZkCatalogRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/zk-catalog', async (req, res) => {
    const data = await getZkCatalogData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/zk-catalog/:slug', async (req, res) => {
    const data = await getZkCatalogProjectData(manifest, req.params.slug)
    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

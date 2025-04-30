import type { Router } from 'express'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getGovernanceData } from './getGovernanceData'
import { getGovernancePublicationData } from './publication/getGovernancePublicationData'
import { getGovernancePublicationsData } from './publications/getGovernancePublicationsData'

export function GovernanceRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/governance', async (req, res) => {
    const data = await getGovernanceData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/governance/publications', async (req, res) => {
    const data = await getGovernancePublicationsData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get(
    '/governance/publications/:id',
    validateRoute({
      params: z.object({ id: z.string() }),
    }),
    async (req, res) => {
      const data = await getGovernancePublicationData(
        manifest,
        req.params.id,
        req.originalUrl,
      )

      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    },
  )
}

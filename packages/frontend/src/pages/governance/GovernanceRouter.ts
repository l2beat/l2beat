import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getGovernanceData } from './GetGovernanceData'
import { getGovernancePublicationData } from './publication/GetGovernancePublicationData'
import { getGovernancePublicationsData } from './publications/GetGovernancePublicationsData'

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

  router.get('/governance/publications', async (req, res) => {
    const data = await getGovernancePublicationsData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/governance/publications/:id',
    validateRoute({
      params: v.object({ id: v.string() }),
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
      res.status(200).send(html)
    },
  )

  return router
}

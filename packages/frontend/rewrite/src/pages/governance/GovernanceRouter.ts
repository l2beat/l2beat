import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod/v4'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getGovernanceData } from './getGovernanceData'
import { getGovernancePublicationData } from './publication/getGovernancePublicationData'
import { getGovernancePublicationsData } from './publications/getGovernancePublicationsData'

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
      res.status(200).send(html)
    },
  )

  return router
}

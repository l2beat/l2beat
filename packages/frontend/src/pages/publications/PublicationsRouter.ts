import { v } from '@l2beat/validate'
import express from 'express'
import { getCollectionEntry } from '~/content/getCollection'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getPublicationsData } from './getPublicationsData'
import { getGovernancePublicationData } from './governance/GetGovernancePublicationData'

export function createPublicationsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/publications', async (req, res) => {
    const data = await getPublicationsData(manifest, req.originalUrl)

    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/publications/:id',
    validateRoute({
      params: v.object({ id: v.string() }),
    }),
    async (req, res) => {
      const isGovernancePublication = getCollectionEntry(
        'governance-publications',
        req.params.id,
      )

      if (!isGovernancePublication) {
        res.status(404).send('Not found')
        return
      }

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

import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import { getCollectionEntry } from '~/content/getCollection'
import type { RenderData, RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getPublicationsData } from './getPublicationsData'
import { getGovernancePublicationData } from './governance/getGovernancePublicationData'
import { getMonthlyUpdateData } from './monthly-updates/getMonthlyUpdateData'

export function createPublicationsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/publications', async (req, res) => {
    const data = await getPublicationsData(req, manifest)

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
      const governancePublication = getCollectionEntry(
        'governance-publications',
        req.params.id,
      )

      const monthlyUpdate = getCollectionEntry('monthly-updates', req.params.id)

      let data: RenderData | undefined
      if (governancePublication) {
        data = await getGovernancePublicationData(
          req,
          manifest,
          governancePublication,
        )
      }

      if (monthlyUpdate) {
        data = await getMonthlyUpdateData(req, manifest, monthlyUpdate, cache)
      }

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

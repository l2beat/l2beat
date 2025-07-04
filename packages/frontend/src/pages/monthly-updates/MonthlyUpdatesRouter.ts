import { v } from '@l2beat/validate'
import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { getMonthlyUpdateData } from './getMonthlyUpdateData'

export function createMonthlyUpdatesRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get(
    '/publications/monthly-updates/:id',
    validateRoute({
      params: v.object({ id: v.string() }),
    }),
    async (req, res) => {
      const data = await getMonthlyUpdateData(
        manifest,
        req.params.id,
        req.originalUrl,
        cache,
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

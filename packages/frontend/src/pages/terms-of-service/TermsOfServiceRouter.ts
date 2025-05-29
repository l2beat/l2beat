import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getTermsOfServiceData } from './getTermsOfServiceData'

export function createTermsOfServiceRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/terms-of-service', async (req, res) => {
    const data = await getTermsOfServiceData(manifest, req.originalUrl)
    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

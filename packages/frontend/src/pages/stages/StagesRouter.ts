import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getStagesData } from './getStagesData'

export function createStagesRouter(manifest: Manifest, render: RenderFunction) {
  const router = express.Router()

  router.get('/stages', async (req, res) => {
    const data = await getStagesData(manifest, req.originalUrl)
    if (!data) {
      res.status(404).send('Not found')
      return
    }
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

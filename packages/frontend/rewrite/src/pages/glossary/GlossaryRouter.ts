import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getGlossaryData } from './getGlossaryData'

export function createGlossaryRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/glossary', async (req, res) => {
    const data = await getGlossaryData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

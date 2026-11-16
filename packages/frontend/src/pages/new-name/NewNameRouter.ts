import express from 'express'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getNewNameData } from './getNewNameData'

export function createNewNameRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get(RENAME_ANNOUNCEMENT_PATH, async (req, res) => {
    const data = await getNewNameData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

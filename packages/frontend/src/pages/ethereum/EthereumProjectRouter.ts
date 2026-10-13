import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import {
  getEthereumProjectData,
  getEthereumProjectMarkdown,
} from './getEthereumProjectData'
import { ETHEREUM_PROJECT_PATH } from './paths'

export function createEthereumProjectRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()
  const getMarkdown = () => getEthereumProjectMarkdown(manifest, cache)

  router.get(`${ETHEREUM_PROJECT_PATH}.md`, serveMarkdown(getMarkdown))

  router.get(
    ETHEREUM_PROJECT_PATH,
    serveMarkdownIfPreferred(getMarkdown),
    async (req, res) => {
      const data = await getEthereumProjectData(manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

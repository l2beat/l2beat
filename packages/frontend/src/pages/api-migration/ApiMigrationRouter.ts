import express from 'express'
import { API_MIGRATION_GUIDE_PATH } from '~/consts/publicApi'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getApiMigrationData } from './getApiMigrationData'
import {
  API_MIGRATION_GUIDE_TITLE,
  getApiMigrationGuideMarkdown,
} from './getApiMigrationGuideMarkdown'

/**
 * The guide for moving off the old public API. Its readers are mostly
 * scripts' maintainers and agents sent here by a response header, so it is
 * served as markdown too, like the other pages agents read.
 */
export function createApiMigrationRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()
  const getMarkdown = () =>
    Promise.resolve(
      `# ${API_MIGRATION_GUIDE_TITLE}\n\n${getApiMigrationGuideMarkdown()}\n`,
    )

  router.get(`${API_MIGRATION_GUIDE_PATH}.md`, serveMarkdown(getMarkdown))
  router.get(
    API_MIGRATION_GUIDE_PATH,
    serveMarkdownIfPreferred(getMarkdown),
    async (req, res) => {
      const data = await getApiMigrationData(manifest, req.originalUrl)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}

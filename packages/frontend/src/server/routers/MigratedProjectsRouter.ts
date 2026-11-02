import express from 'express'
import { withQueryOf } from '~/server/utils/withQueryOf'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  for (const [from, to] of Object.entries(RENAMED_SCALING_SLUGS)) {
    const oldPath = `/layer2s/projects/${from}`
    const newPath = `/layer2s/projects/${to}`
    router.get(oldPath, (req, res) =>
      res.redirect(301, withQueryOf(req, newPath)),
    )
    router.get(`${oldPath}.md`, (req, res) =>
      res.redirect(301, withQueryOf(req, `${newPath}.md`)),
    )
    router.get(`${oldPath}/tvs-breakdown`, (req, res) =>
      res.redirect(301, withQueryOf(req, `${newPath}/tvs-breakdown`)),
    )
  }
  return router
}

/** Every variant of the page (HTML, .md, TVS breakdown) redirects. */
const RENAMED_SCALING_SLUGS: Record<string, string> = {
  zksync: 'zksync-lite',
  zksync2: 'zksync-era',
  optimism: 'op-mainnet',
  ethernity: 'epicchain',
}

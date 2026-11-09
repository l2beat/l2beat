import express from 'express'
import { getProjectPath } from '~/utils/project/getProjectUrl'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  for (const [from, to] of Object.entries(RENAMED_SCALING_SLUGS)) {
    const newPath = getProjectPath(to)
    // The L2 URL it had, and the one under /projects it has since redirected from.
    for (const oldPath of [`/layer2s/projects/${from}`, getProjectPath(from)]) {
      router.get(oldPath, (_, res) => res.redirect(301, newPath))
      router.get(`${oldPath}.md`, (_, res) =>
        res.redirect(301, `${newPath}.md`),
      )
      router.get(`${oldPath}/tvs-breakdown`, (_, res) =>
        res.redirect(301, `${newPath}/tvs-breakdown`),
      )
    }
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

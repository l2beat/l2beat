import express from 'express'
import {
  getProjectPath,
  getProjectTvsBreakdownPath,
} from '~/utils/project/getProjectPath'
import { redirectToProjectPage } from './redirectToProjectPage'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  for (const [from, to] of Object.entries(RENAMED_SCALING_SLUGS)) {
    // The L2 URL it had, and the one under /projects it has since redirected from.
    for (const oldPath of [`/layer2s/projects/${from}`, getProjectPath(from)]) {
      router.get(oldPath, (req, res) =>
        redirectToProjectPage(req, res, getProjectPath(to)),
      )
      router.get(`${oldPath}.md`, (req, res) =>
        redirectToProjectPage(req, res, `${getProjectPath(to)}.md`),
      )
      router.get(`${oldPath}/tvs-breakdown`, (req, res) =>
        redirectToProjectPage(req, res, getProjectTvsBreakdownPath(to)),
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

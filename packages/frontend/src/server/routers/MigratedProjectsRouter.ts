import express from 'express'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  for (const [from, to] of Object.entries(RENAMED_SCALING_SLUGS)) {
    const oldPath = `/layer2s/projects/${from}`
    const newPath = `/layer2s/projects/${to}`
    router.get(oldPath, (_, res) => res.redirect(301, newPath))
    router.get(`${oldPath}.md`, (_, res) => res.redirect(301, `${newPath}.md`))
    router.get(`${oldPath}/tvs-breakdown`, (_, res) =>
      res.redirect(301, `${newPath}/tvs-breakdown`),
    )
  }

  for (const [from, to] of Object.entries(RENAMED_DA_PAGES)) {
    router.get(from, (_, res) => res.redirect(301, to))
    router.get(`${from}.md`, (_, res) => res.redirect(301, `${to}.md`))
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

/** Old page path to new page path. The HTML page and its .md variant redirect. */
const RENAMED_DA_PAGES: Record<string, string> = {
  '/data-availability/projects/espressoDA/espressoDA':
    '/data-availability/projects/espresso-da/espresso-da',
  '/data-availability/projects/eigenda/eigenda-v2':
    '/data-availability/projects/eigenda/eigenda',
}

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

  router.get('/data-availability/projects/espressoDA/espressoDA', (_, res) => {
    res.redirect(301, '/data-availability/projects/espresso-da/espresso-da')
  })

  router.get('/data-availability/projects/eigenda/eigenda-v2', (_, res) => {
    res.redirect(301, '/data-availability/projects/eigenda/eigenda')
  })
  return router
}

/** Old slug to new slug. Every variant of the page (HTML, .md, TVS breakdown) redirects. */
const RENAMED_SCALING_SLUGS: Record<string, string> = {
  zksync: 'zksync-lite',
  zksync2: 'zksync-era',
  optimism: 'op-mainnet',
  ethernity: 'epicchain',
}

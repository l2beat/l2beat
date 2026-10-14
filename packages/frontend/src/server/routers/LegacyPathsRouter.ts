import express from 'express'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  // A live page, not a legacy path: skip the rest of this router.
  router.get(
    [ETHEREUM_PROJECT_PATH, `${ETHEREUM_PROJECT_PATH}.md`],
    (_req, _res, next) => next('router'),
  )

  router.get('/projects/:name', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  router.get('/scaling/tvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/scaling/detailedTvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/scaling/finality', (_, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/scaling/projects/:name/tvl-breakdown', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}/tvs-breakdown`)
  })

  router.get('/data-availability/projects/:name/dac', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  // Before the catch-all below: Ethereum's page outlived the other DA pages.
  router.get('/data-availability/projects/ethereum/ethereum', (_req, res) => {
    res.redirect(301, ETHEREUM_PROJECT_PATH)
  })
  router.get(
    '/data-availability/projects/ethereum/ethereum.md',
    (_req, res) => {
      res.redirect(301, `${ETHEREUM_PROJECT_PATH}.md`)
    },
  )

  // Blobs replaced the data availability pages.
  router.get(
    ['/data-availability', '/data-availability/*splat', '/da-risk-framework'],
    (_req, res) => {
      res.redirect(301, '/blobs')
    },
  )

  router.get('/governance/publications/:id', (req, res) => {
    res.redirect(301, `/publications/${req.params.id}`)
  })

  router.get('/scaling/data-availability', (_, res) => {
    res.redirect(301, '/layer2s/risk/data-availability')
  })

  router.get('/scaling/sequencing', (_, res) => {
    res.redirect(301, '/layer2s/risk/sequencing')
  })

  router.get('/scaling', (_, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/scaling/*splat', (req, res) => {
    const target = req.originalUrl.replace(/^\/scaling\//, '/layer2s/')
    // The literal prefix guarantees a same-origin path (cannot start with "//"
    // or a scheme), so the user-provided remainder cannot redirect off-site.
    if (!target.startsWith('/layer2s/')) {
      res.redirect(301, '/layer2s/summary')
      return
    }
    res.redirect(301, target)
  })

  router.get('/bridges/*splat', (_req, res) => {
    res.redirect(301, '/interop')
  })
  router.get('/bridges', (_req, res) => {
    res.redirect(301, '/interop')
  })

  return router
}

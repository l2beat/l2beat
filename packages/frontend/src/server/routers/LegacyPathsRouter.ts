import express from 'express'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

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
    res.redirect(301, req.originalUrl.replace(/^\/scaling/, '/layer2s'))
  })

  router.get('/bridges/*splat', (_req, res) => {
    res.redirect(301, '/interop')
  })
  router.get('/bridges', (_req, res) => {
    res.redirect(301, '/interop')
  })

  return router
}

import express from 'express'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  router.get('/projects/:name', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  router.get('/layer2s/tvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/layer2s/detailedTvl', (_, res) => {
    res.redirect(301, '/layer2s/tvs')
  })

  router.get('/layer2s/finality', (_, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/layer2s/projects/:name/tvl-breakdown', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}/tvs-breakdown`)
  })

  router.get('/data-availability/projects/:name/dac', (req, res) => {
    res.redirect(301, `/layer2s/projects/${req.params.name}`)
  })

  router.get('/governance/publications/:id', (req, res) => {
    res.redirect(301, `/publications/${req.params.id}`)
  })

  router.get('/layer2s/data-availability', (_, res) => {
    res.redirect(301, '/layer2s/risk/data-availability')
  })

  router.get('/layer2s/sequencing', (_, res) => {
    res.redirect(301, '/layer2s/risk/sequencing')
  })

  router.get('/bridges/*splat', (_req, res) => {
    res.redirect(301, '/interop')
  })
  router.get('/bridges', (_req, res) => {
    res.redirect(301, '/interop')
  })

  router.get('/scaling/*splat', (req, res) => {
    res.redirect(301, req.originalUrl.replace(/^\/scaling/, '/layer2s'))
  })
  router.get('/scaling', (req, res) => {
    res.redirect(301, req.originalUrl.replace(/^\/scaling/, '/layer2s'))
  })

  return router
}

import express from 'express'

export function createLegacyPathsRouter() {
  const router = express.Router()

  router.get('/project/:name', (req, res) => {
    res.redirect(301, `/scaling/projects/${req.params.name}`)
  })

  router.get('/projects/:name', (req, res) => {
    res.redirect(301, `/scaling/projects/${req.params.name}`)
  })

  router.get('/scaling/tvl', (_, res) => {
    res.redirect(301, '/scaling/tvs')
  })

  router.get('/scaling/detailedTvl', (_, res) => {
    res.redirect(301, '/scaling/tvs')
  })

  router.get('/scaling/finality', (_, res) => {
    res.redirect(301, '/scaling/summary')
  })

  router.get('/scaling/projects/:name/tvl-breakdown', (req, res) => {
    res.redirect(301, `/scaling/projects/${req.params.name}/tvs-breakdown`)
  })

  router.get('/data-availability/projects/:name/dac', (req, res) => {
    res.redirect(301, `/scaling/projects/${req.params.name}`)
  })

  return router
}

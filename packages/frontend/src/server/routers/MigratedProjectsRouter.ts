import express from 'express'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  router.get('/layer2s/projects/zksync', (_, res) => {
    res.redirect(301, '/layer2s/projects/zksync-lite')
  })
  router.get('/layer2s/projects/zksync/tvs-breakdown', (_, res) => {
    res.redirect(301, '/layer2s/projects/zksync-lite/tvs-breakdown')
  })

  router.get('/layer2s/projects/zksync2', (_, res) => {
    res.redirect(301, '/layer2s/projects/zksync-era')
  })
  router.get('/layer2s/projects/zksync2/tvs-breakdown', (_, res) => {
    res.redirect(301, '/layer2s/projects/zksync-era/tvs-breakdown')
  })

  router.get('/layer2s/projects/optimism', (_, res) => {
    res.redirect(301, '/layer2s/projects/op-mainnet')
  })
  router.get('/layer2s/projects/optimism/tvs-breakdown', (_, res) => {
    res.redirect(301, '/layer2s/projects/op-mainnet/tvs-breakdown')
  })

  router.get('/layer2s/projects/ethernity', (_, res) => {
    res.redirect(301, '/layer2s/projects/epicchain')
  })
  router.get('/layer2s/projects/ethernity/tvs-breakdown', (_, res) => {
    res.redirect(301, '/layer2s/projects/epicchain/tvs-breakdown')
  })

  router.get('/data-availability/projects/espressoDA/espressoDA', (_, res) => {
    res.redirect(301, '/data-availability/projects/espresso-da/espresso-da')
  })
  return router
}

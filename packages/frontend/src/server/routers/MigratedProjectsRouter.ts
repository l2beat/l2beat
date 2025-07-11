import express from 'express'

export function createMigratedProjectsRouter() {
  const router = express.Router()

  router.get('/scaling/projects/zksync', (_, res) => {
    res.redirect(301, '/scaling/projects/zksync-lite')
  })
  router.get('/scaling/projects/zksync/tvs-breakdown', (_, res) => {
    res.redirect(301, '/scaling/projects/zksync-lite/tvs-breakdown')
  })

  router.get('/scaling/projects/zksync2', (_, res) => {
    res.redirect(301, '/scaling/projects/zksync-era')
  })
  router.get('/scaling/projects/zksync2/tvs-breakdown', (_, res) => {
    res.redirect(301, '/scaling/projects/zksync-era/tvs-breakdown')
  })

  router.get('/scaling/projects/optimism', (_, res) => {
    res.redirect(301, '/scaling/projects/op-mainnet')
  })
  router.get('/scaling/projects/optimism/tvs-breakdown', (_, res) => {
    res.redirect(301, '/scaling/projects/op-mainnet/tvs-breakdown')
  })

  router.get('/scaling/projects/ethernity', (_, res) => {
    res.redirect(301, '/scaling/projects/epicchain')
  })
  router.get('/scaling/projects/ethernity/tvs-breakdown', (_, res) => {
    res.redirect(301, '/scaling/projects/epicchain/tvs-breakdown')
  })

  router.get('/data-availability/projects/espressoDA/espressoDA', (_, res) => {
    res.redirect(301, '/data-availability/projects/espresso-da/espresso-da')
  })

  router.get('/zk-catalog/SP1Blobstream', (_, res) => {
    res.redirect(301, '/zk-catalog/sp1-blobstream')
  })

  router.get('/zk-catalog/SP1Vector', (_, res) => {
    res.redirect(301, '/zk-catalog/sp1-vector')
  })

  return router
}

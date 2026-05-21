import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getEthereumConnectData } from './ethereum-connect/getEthereumConnectData'
import { getGovernanceData } from './getGovernanceData'
import { getGovernanceProjectsData } from './projects/getGovernanceProjectsData'

export function createGovernanceRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/governance', async (req, res) => {
    const data = await getGovernanceData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/governance/projects', async (req, res) => {
    const data = await getGovernanceProjectsData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/governance/ethereum-connect', async (req, res) => {
    const data = getEthereumConnectData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}

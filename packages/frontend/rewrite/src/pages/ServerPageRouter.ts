import express from 'express'
import type { Manifest } from '../../../src/utils/Manifest'
import type { RenderFunction } from '../ssr/types'
import { createAboutUsRouter } from './about/AboutUsRouter'
import { createBridgesRouter } from './bridges/BridgesRouter'
import { createDaRiskFrameworkRouter } from './da-risk-framework/DaRiskFrameworkRouter'
import { createDataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { createDonateRouter } from './donate/DonateRouter'
import { createEcosystemsRouter } from './ecosystems/EcosystemsRouter'
import { createFaqRouter } from './faq/FaqRouter'
import { createGlossaryRouter } from './glossary/GlossaryRouter'
import { createGovernanceRouter } from './governance/GovernanceRouter'
import { createMutlisigReportRouter } from './multisig-report/MutlisigReportRouter'
import { createScalingRouter } from './scaling/ScalingRouter'
import { createZkCatalogRouter } from './zk-catalog/ZkCatalogRouter'

export function createServerPageRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.use('/', (_, res, next) => {
    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
    })
    res.setHeaders(headers)
    next()
  })

  router.get('/', async (_, res) => {
    res.redirect('/scaling/summary')
  })

  const routers = [
    createScalingRouter,
    createBridgesRouter,
    createDataAvailabilityRouter,
    createZkCatalogRouter,
    createEcosystemsRouter,
    createGovernanceRouter,
    createFaqRouter,
    createAboutUsRouter,
    createDonateRouter,
    createGlossaryRouter,
    createDaRiskFrameworkRouter,
    createMutlisigReportRouter,
  ]

  for (const createRouter of routers) {
    router.use('/', createRouter(manifest, render))
  }

  return router
}

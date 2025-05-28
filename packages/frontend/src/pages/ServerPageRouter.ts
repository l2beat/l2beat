import express from 'express'
import { InMemoryCache } from '../server/cache/InMemoryCache'
import type { RenderFunction } from '../ssr/types'
import type { Manifest } from '../utils/Manifest'
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
import { createTermsOfServiceRouter } from './terms-of-service/TermsOfServiceRouter'

export function createServerPageRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()
  const cache = new InMemoryCache()

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
    createTermsOfServiceRouter,
  ]

  for (const createRouter of routers) {
    const subRouter = createRouter(manifest, render, cache)
    if (subRouter) {
      router.use('/', subRouter)
    }
  }

  return router
}

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

  router.get('/', async (req, res) => {
    res.redirect('/scaling/summary')
  })

  router.use('/scaling', createScalingRouter(manifest, render))
  router.use('/bridges', createBridgesRouter(manifest, render))
  router.use(
    '/data-availability',
    createDataAvailabilityRouter(manifest, render),
  )
  router.use('/zk-catalog', createZkCatalogRouter(manifest, render))
  router.use('/ecosystems', createEcosystemsRouter(manifest, render))
  router.use('/governance', createGovernanceRouter(manifest, render))
  router.use('/faq', createFaqRouter(manifest, render))
  router.use('/about', createAboutUsRouter(manifest, render))
  router.use('/donate', createDonateRouter(manifest, render))
  router.use('/glossary', createGlossaryRouter(manifest, render))
  router.use(
    '/da-risk-framework',
    createDaRiskFrameworkRouter(manifest, render),
  )
  router.use('/multisig-report', createMutlisigReportRouter(manifest, render))

  return router
}

import express from 'express'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import type { RenderFunction } from '../ssr/types'
import type { Manifest } from '../utils/Manifest'
import { createAboutUsRouter } from './about/AboutUsRouter'
import { createBrandKitRouter } from './brand-kit/BrandKitRouter'
import { createChangelogRouter } from './changelog/ChangelogRouter'
import { createDaRiskFrameworkRouter } from './da-risk-framework/DaRiskFrameworkRouter'
import { createDataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { createDevRouter } from './dev/DevRouter'
import { createDonateRouter } from './donate/DonateRouter'
import { createEcosystemsRouter } from './ecosystems/EcosystemsRouter'
import { createFaqRouter } from './faq/FaqRouter'
import { createGlossaryRouter } from './glossary/GlossaryRouter'
import { createGovernanceRouter } from './governance/GovernanceRouter'
import { createInteropRouter } from './interop/InteropRouter'
import { createMultisigReportRouter } from './multisig-report/MutlisigReportRouter'
import { createNativeRollupsRouter } from './native-rollups/NativeRollupsRouter'
import { createPrivacyRouter } from './privacy/PrivacyRouter'
import { createProjectsRouter } from './projects/ProjectsRouter'
import { createPublicationsRouter } from './publications/PublicationsRouter'
import { createScalingRouter } from './scaling/ScalingRouter'
import { createStagesRouter } from './stages/StagesRouter'
import { createTermsOfServiceRouter } from './terms-of-service/TermsOfServiceRouter'
import { createZkCatalogRouter } from './zk-catalog/ZkCatalogRouter'

const cache = new FrontendInMemoryCache('createServerPageRouter')

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

  router.get('/', (_req, res) => {
    // Temporary redirect so browsers drop the previously cached 301 before
    // "/" starts serving the home page. no-cache (not no-store) so the
    // response is stored and replaces the old 301 entry, but is revalidated
    // (refetched, since 307 has no validators) on every use.
    res.set('Cache-Control', 'no-cache')
    res.redirect(307, '/scaling/summary')
  })

  const routers = [
    createProjectsRouter,
    createScalingRouter,
    createInteropRouter,
    createDataAvailabilityRouter,
    createZkCatalogRouter,
    createEcosystemsRouter,
    createGovernanceRouter,
    createNativeRollupsRouter,
    createFaqRouter,
    createAboutUsRouter,
    createBrandKitRouter,
    createChangelogRouter,
    createDonateRouter,
    createGlossaryRouter,
    createDaRiskFrameworkRouter,
    createMultisigReportRouter,
    createPrivacyRouter,
    createTermsOfServiceRouter,
    createStagesRouter,
    createPublicationsRouter,
    createDevRouter,
  ]

  for (const createRouter of routers) {
    const subRouter = createRouter(manifest, render, cache)
    if (subRouter) {
      router.use('/', subRouter)
    }
  }

  return router
}

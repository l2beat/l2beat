import express from 'express'
import {
  ClearPageCacheMiddleware,
  PageCacheMiddleware,
} from '~/server/middlewares/PageCacheMiddleware'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import type { RenderFunction } from '../ssr/types'
import type { Manifest } from '../utils/Manifest'
import { createAboutUsRouter } from './about/AboutUsRouter'
import { createBlobsRouter } from './blobs/BlobsRouter'
import { createBrandKitRouter } from './brand-kit/BrandKitRouter'
import { createChangelogRouter } from './changelog/ChangelogRouter'
import { createDaRiskFrameworkRouter } from './da-risk-framework/DaRiskFrameworkRouter'
import { createDataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { createDefiRouter } from './defi/DefiRouter'
import { createDevRouter } from './dev/DevRouter'
import { createDonateRouter } from './donate/DonateRouter'
import { createEcosystemsRouter } from './ecosystems/EcosystemsRouter'
import { createFaqRouter } from './faq/FaqRouter'
import { createGardenRouter } from './garden/GardenRouter'
import { createGlossaryRouter } from './glossary/GlossaryRouter'
import { createGovernanceRouter } from './governance/GovernanceRouter'
import { createHomeRouter } from './home/HomeRouter'
import { createInteropRouter } from './interop/InteropRouter'
import { createL2Router } from './layer2s/L2Router'
import { createMultisigReportRouter } from './multisig-report/MutlisigReportRouter'
import { createNativeRollupsRouter } from './native-rollups/NativeRollupsRouter'
import { NotFoundHandler } from './not-found/NotFoundHandler'
import { createOssificationRouter } from './ossification/OssificationRouter'
import { createPrivacyRouter } from './privacy/PrivacyRouter'
import { createPublicationsRouter } from './publications/PublicationsRouter'
import { createStagesRouter } from './stages/StagesRouter'
import { createTermsOfServiceRouter } from './terms-of-service/TermsOfServiceRouter'
import { createTokensRouter } from './tokens/TokensRouter'
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

  // Cloudflare edge-caches HTML only when the origin sends Cache-Control.
  // Routes that must not be cached override it later in the chain.
  router.use('/', PageCacheMiddleware())

  const routers = [
    createHomeRouter,
    createL2Router,
    createInteropRouter,
    createTokensRouter,
    createDataAvailabilityRouter,
    createBlobsRouter,
    createZkCatalogRouter,
    createEcosystemsRouter,
    createGovernanceRouter,
    createNativeRollupsRouter,
    createFaqRouter,
    createGardenRouter,
    createAboutUsRouter,
    createBrandKitRouter,
    createChangelogRouter,
    createDonateRouter,
    createGlossaryRouter,
    createDaRiskFrameworkRouter,
    createMultisigReportRouter,
    createPrivacyRouter,
    createDefiRouter,
    createOssificationRouter,
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

  // Anything reaching here is a 404 and must not be edge-cached.
  router.use('/', ClearPageCacheMiddleware())
  router.use('/', NotFoundHandler(manifest, render))

  return router
}

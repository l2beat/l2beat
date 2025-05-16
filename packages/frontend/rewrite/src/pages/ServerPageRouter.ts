import type { Router } from 'express'
import type { Manifest } from '../../../src/utils/Manifest'
import type { RenderFunction } from '../ssr/types'
import { AboutUsRouter } from './about/AboutUsRouter'
import { BridgesRouter } from './bridges/BridgesRouter'
import { DaRiskFrameworkRouter } from './da-risk-framework/DaRiskFrameworkRouter'
import { DataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { DonateRouter } from './donate/DonateRouter'
import { EcosystemsRouter } from './ecosystems/EcosystemsRouter'
import { FaqRouter } from './faq/FaqRouter'
import { GlossaryRouter } from './glossary/GlossaryRouter'
import { GovernanceRouter } from './governance/GovernanceRouter'
import { MutlisigReportRouter } from './multisig-report/MutlisigReportRouter'
import { ScalingRouter } from './scaling/ScalingRouter'
import { ZkCatalogRouter } from './zk-catalog/ZkCatalogRouter'

export function ServerPageRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/', async (req, res) => {
    res.redirect('/scaling/summary')
  })

  ScalingRouter(app, manifest, render)
  BridgesRouter(app, manifest, render)
  DataAvailabilityRouter(app, manifest, render)
  ZkCatalogRouter(app, manifest, render)
  EcosystemsRouter(app, manifest, render)
  GovernanceRouter(app, manifest, render)
  FaqRouter(app, manifest, render)
  AboutUsRouter(app, manifest, render)
  DonateRouter(app, manifest, render)
  GlossaryRouter(app, manifest, render)
  DaRiskFrameworkRouter(app, manifest, render)
  MutlisigReportRouter(app, manifest, render)
}

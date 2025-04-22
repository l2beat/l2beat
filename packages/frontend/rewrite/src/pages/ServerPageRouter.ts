import type { Router } from 'express'
import type { Manifest } from '../common/Manifest'
import type { RenderFunction } from '../ssr/server'
import { AboutUsRouter } from './about/AboutUsRouter'
import { BridgesRouter } from './bridges/BridgesRouter'
import { DataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { DonateRouter } from './donate/DonateRouter'
import { FaqRouter } from './faq/FaqRouter'
import { ScalingRouter } from './scaling/ScalingRouter'
import { ZkCatalogRouter } from './zk-catalog/ZkCatalogRouter'

export function ServerPageRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  ScalingRouter(app, manifest, render)
  BridgesRouter(app, manifest, render)
  DataAvailabilityRouter(app, manifest, render)
  ZkCatalogRouter(app, manifest, render)
  FaqRouter(app, manifest, render)
  AboutUsRouter(app, manifest, render)
  DonateRouter(app, manifest, render)
}

import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { ActivityRouter } from './activity/ActivityRouter'
import { CostsRouter } from './costs/CostsRouter'
import { DataAvailabilityRouter } from './data-availability/DataAvailabilityRouter'
import { FinalityRouter } from './finality/FinalityRouter'
import { LivenessRouter } from './liveness/LivenessRouter'
import { RiskRouter } from './risk/RiskRouter'
import { SummaryRouter } from './summary/SummaryRouter'
import { TvsRouter } from './tvs/TvsRouter'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  SummaryRouter(app, manifest, render)
  ActivityRouter(app, manifest, render)
  RiskRouter(app, manifest, render)
  TvsRouter(app, manifest, render)
  DataAvailabilityRouter(app, manifest, render)
  LivenessRouter(app, manifest, render)
  FinalityRouter(app, manifest, render)
  CostsRouter(app, manifest, render)
}

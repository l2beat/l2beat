import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { ActivityRouter } from './activity/ActivityRouter'
import { RiskRouter } from './risk/RiskRouter'
import { SummaryRouter } from './summary/SummaryRouter'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  SummaryRouter(app, manifest, render)
  ActivityRouter(app, manifest, render)
  RiskRouter(app, manifest, render)
}

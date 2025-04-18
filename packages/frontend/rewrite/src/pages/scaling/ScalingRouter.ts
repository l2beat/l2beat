import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { ActivityRouter } from './activity/ActivityRouter'
import { RiskRouter } from './risk/RiskRouter'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  ActivityRouter(app, manifest, render)
  RiskRouter(app, manifest, render)
}

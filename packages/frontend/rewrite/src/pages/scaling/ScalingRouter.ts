import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { ScalingActivityRouter } from './activity/ScalingActivityRouter'
import { ScalingArchivedRouter } from './archived/ScalingArchivedRouter'
import { ScalingCostsRouter } from './costs/ScalingCostsRouter'
import { ScalingDataAvailabilityRouter } from './data-availability/ScalingDataAvailabilityRouter'
import { ScalingFinalityRouter } from './finality/ScalingFinalityRouter'
import { ScalingLivenessRouter } from './liveness/ScalingLivenessRouter'
import { ScalingRiskRouter } from './risk/ScalingRiskRouter'
import { ScalingSummaryRouter } from './summary/ScalingSummaryRouter'
import { ScalingTvsRouter } from './tvs/ScalingTvsRouter'
import { ScalingUpcomingRouter } from './upcoming/ScalingUpcomingRouter'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  ScalingSummaryRouter(app, manifest, render)
  ScalingActivityRouter(app, manifest, render)
  ScalingRiskRouter(app, manifest, render)
  ScalingTvsRouter(app, manifest, render)
  ScalingDataAvailabilityRouter(app, manifest, render)
  ScalingLivenessRouter(app, manifest, render)
  ScalingFinalityRouter(app, manifest, render)
  ScalingCostsRouter(app, manifest, render)
  ScalingArchivedRouter(app, manifest, render)
  ScalingUpcomingRouter(app, manifest, render)
}

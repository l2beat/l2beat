import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { DataAvailabilityRiskRouter } from './risk/DataAvailabilityRiskRouter'
import { DataAvailabilitySummaryRouter } from './summary/DataAvailabilitySummaryRouter'

export function DataAvailabilityRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  DataAvailabilitySummaryRouter(app, manifest, render)
  DataAvailabilityRiskRouter(app, manifest, render)
}

import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { BridgesArchivedRouter } from './archived/BridgesArchivedRouter'
import { BridgesRiskRouter } from './risk/BridgesRiskRouter'
import { BridgesSummaryRouter } from './summary/BridgesSummaryRouter'

export function BridgesRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  BridgesSummaryRouter(app, manifest, render)
  BridgesRiskRouter(app, manifest, render)
  BridgesArchivedRouter(app, manifest, render)
}

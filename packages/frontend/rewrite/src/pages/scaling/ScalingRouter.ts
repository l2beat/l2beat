import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { ActivityRouter } from './activity/ActivityRouter'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  ActivityRouter(app, manifest, render)
}

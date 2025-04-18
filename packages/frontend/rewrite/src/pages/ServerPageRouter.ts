import type { Router } from 'express'
import type { Manifest } from '../common/Manifest'
import type { RenderFunction } from '../ssr/server'
import { AboutUsRouter } from './about/AboutUsRouter'
import { DonateRouter } from './donate/DonateRouter'
import { FaqRouter } from './faq/FaqRouter'
import { ScalingRouter } from './scaling/ScalingRouter'

export function ServerPageRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  ScalingRouter(app, manifest, render)
  FaqRouter(app, manifest, render)
  AboutUsRouter(app, manifest, render)
  DonateRouter(app, manifest, render)
}

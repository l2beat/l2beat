import type { Router } from 'express'
import type { Manifest } from '../common/Manifest'
import type { RenderFunction } from '../ssr/server'
import { FaqRouter } from './faq/FaqRouter'
import { HomeRouter } from './home/HomeRouter'
import { ProductRouter } from './product/ProductRouter'
import { AboutUsRouter } from './about/AboutUsRouter'
import { DonateRouter } from './donate/DonateRouter'

export function ServerPageRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  HomeRouter(app, manifest, render)
  ProductRouter(app, manifest, render)
  FaqRouter(app, manifest, render)
  AboutUsRouter(app, manifest, render)
  DonateRouter(app, manifest, render)
}

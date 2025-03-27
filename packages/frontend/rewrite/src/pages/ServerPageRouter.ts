import type { Router } from 'express'
import type { Manifest } from '../common/Manifest'
import type { RenderFunction } from '../ssr/server'
import { HomeRouter } from './home/HomeRouter'
import { ProductRouter } from './product/ProductRouter'
import { FaqRouter } from './faq/FaqRouter'

export function ServerPageRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  HomeRouter(app, manifest, render)
  ProductRouter(app, manifest, render)
  FaqRouter(app, manifest, render)
}

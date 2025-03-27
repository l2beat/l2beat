import type { Router } from 'express'
import type { Manifest } from '../common/Manifest'
import type { Render } from '../ssr/types'
import { HomeRouter } from './home/HomeRouter'
import { ProductRouter } from './product/ProductRouter'

export function PageRouter(app: Router, manifest: Manifest, render: Render) {
  HomeRouter(app, manifest, render)
  ProductRouter(app, render)
}

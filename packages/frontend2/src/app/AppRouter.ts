import type { Application } from 'express'
import type { Render } from '../ssr/types'
import { HomeRouter } from './home/HomeRouter'
import { ProductRouter } from './product/ProductRouter'

export function AppRouter(app: Application, render: Render) {
  HomeRouter(app, render)
  ProductRouter(app, render)
}

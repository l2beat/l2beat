import express, { Router } from 'express'
import { initStaticAssets } from '../assets'

export function StaticRouter(): Router {
  const router = Router()

  const assets = initStaticAssets()
  router.use(
    assets.handlerPath,
    express.static(
      assets.staticPath,
      assets.enableCache ? { maxAge: '1y', immutable: true } : undefined,
    ),
  )

  return router
}

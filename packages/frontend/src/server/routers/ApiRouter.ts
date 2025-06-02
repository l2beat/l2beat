import express from 'express'
import { createInternalApiRouter } from './InternalApiRouter'
import { createPublicApiRouter } from './PublicApiRouter'

export function createApiRouter() {
  const router = express.Router()

  router.use('/api', (_, res, next) => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    })
    res.setHeaders(headers)
    next()
  })

  router.use('/', createPublicApiRouter())
  router.use('/', createInternalApiRouter())

  return router
}

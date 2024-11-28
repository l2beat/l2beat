import { Router } from 'express'

export function ApiRouter(): Router {
  const router = Router()

  router.get('/api/health', (_req, res) => {
    res.send({ running: true })
  })

  return router
}

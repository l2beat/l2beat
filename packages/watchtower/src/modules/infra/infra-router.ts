import express from 'express'
import type { InfrastructureController } from './infra-controller'

export function createInfrastructureRouter(
  controller: InfrastructureController,
): express.Router {
  const r = express.Router()

  r.post('/frontend-preview', (_req, res) => {
    res.json({ status: controller.handleFrontendPreview() })
  })

  return r
}

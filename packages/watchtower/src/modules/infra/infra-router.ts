import express from 'express'
import type { InfrastructureController } from './infra-controller'
import { z } from 'zod'
import type { Config } from '../../config/types'

function stringAsInt() {
  return z.preprocess((s) => {
    const res = z.string().safeParse(s)
    const maybeNumber = res.success && s !== '' ? Number(res.data) : null

    if (maybeNumber === null) {
      throw new Error('Invalid number')
    }

    const isPositive = maybeNumber > 0

    if (!isPositive) {
      throw new Error('Number must be positive')
    }

    return maybeNumber
  }, z.number().int())
}

const schema = z.object({
  prNumber: stringAsInt(),
})

export function createInfrastructureRouter(
  controller: InfrastructureController,
  config: Config,
): express.Router {
  const r = express.Router()

  r.post(
    '/frontend-preview',
    async (req: express.Request, res: express.Response) => {
      const auth = req.headers.authorization

      if (auth !== `Bearer ${config.secret}`) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const parsed = schema.safeParse(req.body)

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message })
        return
      }

      const { prNumber } = parsed.data

      try {
        await controller.handleFrontendPreview(prNumber)
        res.json({ status: 'OK' })
      } catch (error) {
        console.error('Failed to apply preview deployment', error)
        res.status(500).json({ error: 'Failed to apply preview deployment' })
        return
      }
    },
  )

  return r
}

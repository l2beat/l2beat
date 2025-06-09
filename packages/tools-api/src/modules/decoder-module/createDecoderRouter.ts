import express from 'express'
import { z } from 'zod'
import type { ApiController, ApiQuery } from './domain/ApiController'

export function createDecoderRouter(controller: ApiController): express.Router {
  const router = express.Router()

  router.get('/api/decode', async (req, res) => {
    const query = parseQuery(req.query)
    const result = await controller.handle(query)
    res.json(result)
  })

  router.post(
    '/api/decode',
    express.json({ limit: '20mb' }),
    async (req, res) => {
      const query = parseQuery(req.body)
      const result = await controller.handle(query)
      res.json(result)
    },
  )

  return router
}

const DecodeQuery = z.object({
  hash: z
    .string()
    .regex(/^0x[a-f\d]{64}$/)
    .optional(),
  data: z
    .string()
    .regex(/^0x([a-f\d]{2})*$/)
    .optional(),
  to: z
    .string()
    .regex(/^0x[a-f\d]{40}$/)
    .optional(),
  chainId: z.string().optional(),
})

function parseQuery(data: unknown): ApiQuery {
  const query = DecodeQuery.parse(data)
  return {
    hash: query.hash as `0x${string}`,
    data: query.data as `0x${string}`,
    to: query.to as `0x${string}`,
    chainId: query.chainId ? parseInt(query.chainId) : undefined,
  }
}

import { v as z } from '@l2beat/validate'
import express from 'express'
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
    .check((v) => /^0x[a-f\d]{64}$/.test(v))
    .optional(),
  data: z
    .string()
    .check((v) => /^[A-Za-z0-9_-]*$/.test(v))
    .optional(),
  to: z
    .string()
    .check((v) => /^0x[a-f\d]{40}$/.test(v))
    .optional(),
  chainId: z.string().optional(),
})

function parseQuery(data: unknown): ApiQuery {
  const query = DecodeQuery.parse(data)
  return {
    hash: query.hash as `0x${string}`,
    data: query.data,
    to: query.to as `0x${string}`,
    chainId: query.chainId ? Number.parseInt(query.chainId) : undefined,
  }
}

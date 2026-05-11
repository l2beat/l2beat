import { v as z } from '@l2beat/validate'
import express from 'express'
import type { Chain } from '../../types'
import type { ApiController, ApiQuery } from './domain/ApiController'

export function createDecoderRouter(
  chains: Chain[],
  controller: ApiController,
): express.Router {
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

  router.post('/api/lookup-signatures', express.json(), async (req, res) => {
    const queries = LookupRequest.parse(req.body)
    const result = await controller.lookupSignatures(queries)
    res.json(result)
  })

  router.post('/api/lookup-address', express.json(), async (req, res) => {
    const query = AddressRequest.parse(req.body)
    const result = await controller.lookupAddress(query.chainId, query.address)
    res.json(result)
  })

  router.post('/api/lookup-tx', express.json(), async (req, res) => {
    const query = TransactionRequest.parse(req.body)
    const result = await controller.getTx(query)
    res.json(result)
  })

  router.get('/api/chains', (_, res) => {
    res.json(chains)
  })

  return router
}

const TransactionRequest = z.object({
  chainId: z.number().optional(),
  hash: z.string().check((v): v is `0x${string}` => /^0x[a-f\d]{64}$/.test(v)),
})

const LookupRequest = z.array(
  z.string().check((v): v is `0x${string}` => /^0x[a-f\d]{8}$/.test(v)),
)

const AddressRequest = z.object({
  chainId: z.number(),
  address: z
    .string()
    .check((v): v is `0x${string}` => /^0x[a-f\d]{40}$/.test(v)),
})

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

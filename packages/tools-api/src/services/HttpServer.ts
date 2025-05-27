import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import type { Config } from '../config/types'
import type { ApiController, ApiQuery } from '../domain/ApiController'

export function createHttpServer(
  config: Config,
  controller: ApiController,
  logger: Logger,
) {
  const app = express()

  app.use('/api', cors())

  app.get('/api/decode', async (req, res) => {
    const query = parseQuery(req.query)
    const result = await controller.handle(query)
    res.json(result)
  })
  app.post('/api/decode', express.json({ limit: '20mb' }), async (req, res) => {
    const query = parseQuery(req.body)
    const result = await controller.handle(query)
    res.json(result)
  })

  return {
    start: (): Promise<Server> => {
      return new Promise<Server>((resolve) => {
        const server = app.listen(config.port, () => {
          logger.info(`Listening on http://localhost:${config.port}`)
          resolve(server)
        })
      })
    },
  }
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

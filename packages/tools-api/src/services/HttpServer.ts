import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import type { Config } from '../config/types'
import type { ApiController } from '../domain/ApiController'

export function createHttpServer(
  config: Config,
  controller: ApiController,
  logger: Logger,
) {
  const app = express()

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
  app.get('/api/decode', cors(), async (req, res) => {
    const query = DecodeQuery.parse(req.query)
    const result = await controller.handle({
      hash: query.hash as `0x${string}`,
      data: query.data as `0x${string}`,
      to: query.to as `0x${string}`,
      chainId: query.chainId ? parseInt(query.chainId) : undefined,
    })
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

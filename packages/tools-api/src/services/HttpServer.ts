import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import express from 'express'
import type { Config } from '../config/types'

export function createHttpServer(config: Config, logger: Logger) {
  const app = express()

  app.get('/', (_req, res) => {
    res.send('hello world')
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

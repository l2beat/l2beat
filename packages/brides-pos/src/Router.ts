import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import express from 'express'
import type { Config } from './config'

export function createRouter(config: Config, logger: Logger) {
  const app = express()

  app.get('/', (_req, res) => {
    res.send('Hello World!')
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

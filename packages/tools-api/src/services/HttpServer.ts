import type { Logger } from '@l2beat/backend-tools'
import cors from 'cors'
import express from 'express'
import type { Server } from 'http'
import type { Config } from '../config/types'
import type { ApplicationModule } from './ApplicationModule'

export function createHttpServer(
  config: Config,
  modules: ApplicationModule[],
  logger: Logger,
) {
  const app = express()

  app.use('/api', cors())

  for (const module of modules) {
    for (const router of module.routers ?? []) {
      app.use(router)
    }
  }

  return {
    start: async (): Promise<Server> => {
      for (const module of modules) {
        await module.start?.()
      }

      return new Promise<Server>((resolve) => {
        const server = app.listen(config.port, () => {
          logger.info(`Listening on http://localhost:${config.port}`)
          resolve(server)
        })
      })
    },
  }
}

import { createDatabase } from '@l2beat/database'
import express from 'express'
import { Config } from './config/Config'
import { ApiRouter } from './routes/ApiRouter'
import { PageRouter } from './routes/PageRouter'
import { StaticRouter } from './routes/StaticRouter'
import {
  ActivityService,
  MockActivityService,
} from './services/ActivityService'
import { ICache, InMemoryCache } from './services/Cache'
import { ProjectService } from './services/ProjectService'

export class Application {
  start: () => void

  constructor(config: Config) {
    const db =
      config.database &&
      createDatabase({
        ...config.database.connection,
        ...config.database.connectionPoolSize,
      })

    const cache: ICache = new InMemoryCache()

    const projectService = new ProjectService()
    const activityService = db
      ? new ActivityService(db, cache, projectService)
      : new MockActivityService(projectService)

    const app = express()
    const routers = [ApiRouter(), PageRouter(activityService), StaticRouter()]

    this.start = () => {
      for (const router of routers) {
        app.use(router)
      }

      const port = 8347 // BEAT
      app.listen(port, () => {
        console.log(`Listening on: http://localhost:${port}`)
      })
    }
  }
}

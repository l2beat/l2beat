import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { InMemoryCache } from './cache/InMemoryCache'
import { getConfig } from './config'
import { authMiddleware } from './middleware/authMiddleware'
import { loggerMiddleware } from './middleware/loggerMiddleware'
import { OpenApi } from './OpenApi'
import { addActivityRoutes } from './routes/activity/routes'
import { addProjectsRoutes } from './routes/projects/routes'
import { addTvsRoutes } from './routes/tvs/routes'
import { createLogger } from './utils/logger/createLogger'

function main() {
  const env = getEnv()
  const config = getConfig(env)
  const db = createDatabase(config.database)
  const logger = createLogger(env)

  const ps = new ProjectService()

  const app = express()
  const openapi = new OpenApi(app, {
    openapi: '3.0.0',
    info: {
      title: 'L2BEAT API',
      version: '1.0.0',
    },
    servers: [{ url: config.openapi.url }],
    tags: [
      {
        name: 'projects',
        description:
          'Endpoints for listing projects and retrieving detailed information about individual projects.',
      },
      {
        name: 'tvs',
        description: 'Endpoints for retrieving Total Value Secured (TVS) data',
      },
      {
        name: 'activity',
        description: 'Endpoints for retrieving activity data',
      },
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'apiKey',
        },
      },
    },
    security: [{ apiKeyAuth: [] }],
  })
  const cache = new InMemoryCache({
    logger,
    enabled: config.cacheEnabled,
  })

  app.get('/', (_, res) => {
    res.redirect('/docs')
  })

  app.get('/openapi', (_, res) => {
    res.json(openapi.getOpenApiSchema())
  })

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      customSiteTitle: 'L2BEAT - Swagger UI',
      swaggerOptions: {
        url: '/openapi',
      },
    }),
  )

  if (config.auth) {
    app.use(authMiddleware(config.auth))
  }
  app.use(loggerMiddleware(logger))

  addProjectsRoutes(openapi, ps)
  addTvsRoutes(openapi, ps, db, cache)
  addActivityRoutes(openapi, ps, db, cache)

  app.listen(config.api.port, () => {
    console.log(`Example app listening on port ${config.api.port}`)
  })
}

main()

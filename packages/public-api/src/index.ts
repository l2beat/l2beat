import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { getConfig } from './config'
import { authMiddleware } from './middleware/authMiddleware'
import { errorHandler } from './middleware/errorHandler'
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
    externalDocs: {
      description: 'Changelog',
      url: 'https://l2beat.notion.site/L2BEAT-API-Changelog-2c4094a2aee7809786e6e6b6e7486e01',
    },
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

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.get('/openapi', (_, res) => {
    res.json(openapi.getOpenApiSchema())
  })

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      customSiteTitle: 'L2BEAT - Swagger UI',
      // customJsStr is supported by swagger-ui-express at runtime but missing from its types.
      // op1.js is loaded dynamically (not via customJs) because swagger-ui-express renders
      // customJs before customJsStr without defer/async — that order would run op1.js
      // before the proxy stub exists, so queued init() calls would be lost.
      ...(config.analytics &&
        config.analytics.clientId && {
          customJsStr: `
          window.op = window.op || function () { var n = []; return new Proxy(function () { arguments.length && n.push([].slice.call(arguments)) }, { get: function (t, r) { return "q" === r ? n : function () { n.push([r].concat([].slice.call(arguments))) } }, has: function (t, r) { return "q" === r } }) }();
          window.op('init', {
            clientId: '${config.analytics.clientId}',
            trackScreenViews: true,
            trackOutgoingLinks: true,
            trackAttributes: true,
            apiUrl: 'https://opapi.l2beat.com',
          });
          var s = document.createElement('script');
          s.src = 'https://analytics.l2beat.com/op1.js';
          s.defer = true;
          s.async = true;
          document.head.appendChild(s);
        `,
        }),
      swaggerOptions: {
        url: '/openapi',
      },
    } as swaggerUi.SwaggerUiOptions),
  )

  if (config.auth) {
    app.use(authMiddleware(config.auth))
  }
  app.use(loggerMiddleware(logger))

  addProjectsRoutes(openapi, ps, db, cache)
  addTvsRoutes(openapi, ps, db, cache)
  addActivityRoutes(openapi, ps, db, cache)

  app.use(errorHandler(logger))

  app.listen(config.api.port, () => {
    console.log(`Example app listening on port ${config.api.port}`)
  })
}

main()

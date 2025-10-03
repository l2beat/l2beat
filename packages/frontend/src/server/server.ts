import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import compression from 'compression'
import timeout from 'connect-timeout'
import express from 'express'
import sirv from 'sirv'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import { render } from '../ssr/ServerEntry'
import type { RenderData } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
import { ErrorHandler } from './middlewares/ErrorHandler'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { SafeSendHandler } from './middlewares/SafeSendHandler'
import { createApiRouter } from './routers/ApiRouter'
import { createLegacyPathsRouter } from './routers/LegacyPathsRouter'
import { createMigratedProjectsRouter } from './routers/MigratedProjectsRouter'
import { createPlausibleRouter } from './routers/PlausibleRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT ?? 3000

const template = getTemplate(manifest)

export function createServer(logger: Logger) {
  logger = logger.for('HTTP Server')

  const app = express()
  if (isProduction) {
    app.use(compression())
    app.use(
      '/static',
      sirv('./dist/static', { maxAge: 31536000, immutable: true }),
    )
    // This is done to delay moving markdown to server side
    app.use('/', sirv('./static', { maxAge: 3600 }))
  } else {
    app.use('/', express.static('./static'))
  }

  app.use(timeout('25s'))
  app.use(SafeSendHandler)
  app.use(MetricsMiddleware())

  app.use('/', createMigratedProjectsRouter())
  app.use('/', createLegacyPathsRouter())
  app.use('/api/trpc', createTrpcRouter())
  app.use('/', createServerPageRouter(manifest, renderToHtml))
  app.use('/', createApiRouter())
  app.use('/plausible', createPlausibleRouter())

  if (isProduction) {
    app.use(ErrorHandler())
  }

  const server = app.listen(port, () => {
    const url = isProduction
      ? `Server running on port ${port}`
      : `http://localhost:${port}`

    logger.info('Started', {
      port,
      url,
    })
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use.`)
      process.exit(1)
    } else {
      logger.error('Unhandled server error:', err)
      process.exit(1)
    }
  })
}

function renderToHtml(data: RenderData, url: string) {
  const rendered = render(data, url)
  const envData = Object.fromEntries(
    Object.entries(process.env)
      .map(([key, value]) => {
        if (
          !key.startsWith('CLIENT_SIDE_') &&
          key !== 'NODE_ENV' &&
          key !== 'DEPLOYMENT_ENV'
        ) {
          return undefined
        }
        return [key, value] as const
      })
      .filter((x) => x !== undefined),
  )
  return template
    .replace('<!--app-head-->', rendered.head)
    .replace('<!--app-html-->', rendered.html)
    .replace(
      '<!--ssr-data-->',
      `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    )
    .replace('<!--env-data-->', `window.__ENV__=${JSON.stringify(envData)}`)
}

function getTemplate(manifest: Manifest) {
  let template = readFileSync('index.html', 'utf-8')
  template = template.replace('/index.js', manifest.getUrl('/index.js'))
  return template
}

import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import compression from 'compression'
import timeout from 'connect-timeout'
import express from 'express'
import sirv from 'sirv'
import { rawEnv } from '~/env'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import { render } from '../ssr/ServerEntry'
import type { RenderData, RenderOptions, RenderResult } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
import { ErrorHandler } from './middlewares/ErrorHandler'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { SafeSendHandler } from './middlewares/SafeSendHandler'
import { createApiRouter } from './routers/ApiRouter'
import { createLegacyPathsRouter } from './routers/LegacyPathsRouter'
import { createMigratedProjectsRouter } from './routers/MigratedProjectsRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const port = process.env.PORT ?? 3000

type RenderFn = (
  data: RenderData,
  url: string,
  options?: RenderOptions,
) => RenderResult

export function createServer(baseLogger: Logger) {
  const logger = baseLogger.for('HTTP Server')
  const app = express()
  const template = getTemplate(manifest)

  app.use(compression())
  app.use(
    '/static',
    sirv('./dist/static', { maxAge: 31536000, immutable: true }),
  )
  // This is done to delay moving markdown to server side
  app.use('/', sirv('./static', { maxAge: 3600 }))

  const renderToHtml = (data: RenderData, url: string) => {
    const renderFn: RenderFn = render
    const rendered = renderFn(data, url, {
      stylesheetUrl: manifest.getUrl('/index.css'),
    })

    const html = template
      .replace('<!--app-head-->', rendered.head)
      .replace('<!--app-html-->', rendered.html)
      .replace(
        '<!--ssr-data-->',
        `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
      )
      .replace(
        '<!--env-data-->',
        `window.__ENV__=${JSON.stringify(getClientEnvData())}`,
      )

    return Promise.resolve(html)
  }

  app.use(timeout('25s'))
  app.use(SafeSendHandler)
  app.use(MetricsMiddleware())

  app.use('/', createMigratedProjectsRouter())
  app.use('/', createLegacyPathsRouter())
  app.use('/api/trpc', createTrpcRouter())
  app.use('/', createServerPageRouter(manifest, renderToHtml))
  app.use('/', createApiRouter())

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(ErrorHandler())

  const server = app.listen(port, () => {
    logger.info('Started', {
      port,
      url: `Server running on port ${port}`,
    })
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use.`)
      process.exit(1)
    }

    logger.error('Unhandled server error:', err)
    process.exit(1)
  })
}

function getTemplate(manifest: Manifest) {
  const template = readFileSync('index.html', 'utf-8')
  return template.replace(
    '/src/ssr/ClientEntry.tsx',
    manifest.getUrl('/src/ssr/ClientEntry.tsx'),
  )
}

function getClientEnvData() {
  return Object.fromEntries(
    Object.entries(rawEnv)
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
}

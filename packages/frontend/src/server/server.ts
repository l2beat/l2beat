import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import compression from 'compression'
import timeout from 'connect-timeout'
import express from 'express'
import sirv from 'sirv'
import type { ViteDevServer } from 'vite'
import { rawEnv } from '~/env'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import type { RenderData } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
import { ErrorHandler } from './middlewares/ErrorHandler'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { SafeSendHandler } from './middlewares/SafeSendHandler'
import { createApiRouter } from './routers/ApiRouter'
import { createLegacyPathsRouter } from './routers/LegacyPathsRouter'
import { createMigratedProjectsRouter } from './routers/MigratedProjectsRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const port = process.env.PORT ?? 3000
type ServerMode = 'production' | 'development'

type RenderResult = {
  html: string
  head: string
}

type RenderFn = (data: RenderData, url: string) => RenderResult

export function createServer(logger: Logger) {
  return createHttpServer(logger, 'production')
}

export function createDevServer(logger: Logger) {
  return createHttpServer(logger, 'development')
}

async function createHttpServer(baseLogger: Logger, mode: ServerMode) {
  const isProduction = mode === 'production'
  const logger = baseLogger.for('HTTP Server')
  const app = express()
  const template = getTemplate(manifest, isProduction)

  let vite: ViteDevServer | undefined
  let productionRender: RenderFn | undefined

  if (isProduction) {
    app.use(compression())
    app.use(
      '/static',
      sirv('./dist/static', { maxAge: 31536000, immutable: true }),
    )
    // This is done to delay moving markdown to server side
    app.use('/', sirv('./static', { maxAge: 3600 }))
  } else {
    const { createDevMiddleware } = await import('./createDevMiddleware')
    vite = await createDevMiddleware(app)
    // Serve static assets (fonts, icons, images) that Vite doesn't handle
    app.use('/', express.static('./static'))
  }

  const renderToHtml = async (data: RenderData, url: string) => {
    let renderFn: RenderFn
    if (isProduction) {
      if (!productionRender) {
        const mod = await import('../ssr/ServerEntry')
        productionRender = mod.render
      }
      renderFn = productionRender
    } else {
      if (!vite) {
        throw new Error('Vite dev server is not initialized')
      }
      const mod = await vite.ssrLoadModule('/src/ssr/ServerEntry.tsx')
      renderFn = mod.render as RenderFn
    }

    const rendered = renderFn(data, url)
    const envData = Object.fromEntries(
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

    let head = rendered.head
    if (!isProduction) {
      // In dev, the tailwind CLI isn't running so /index.css doesn't exist.
      // Use Vite's direct CSS request so the browser receives real CSS instead
      // of the JS proxy module that "/src/styles/globals.css" returns.
      head = head.replace(
        /<link rel="stylesheet" href="\/index\.css"\s*\/?>/,
        '<link rel="stylesheet" href="/src/styles/globals.css?direct">',
      )
    }

    let html = template
      .replace('<!--app-head-->', head)
      .replace('<!--app-html-->', rendered.html)
      .replace(
        '<!--ssr-data-->',
        `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
      )
      .replace('<!--env-data-->', `window.__ENV__=${JSON.stringify(envData)}`)

    if (!isProduction && vite) {
      html = await vite.transformIndexHtml(url, html)
    }

    return html
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

function getTemplate(manifest: Manifest, isProduction: boolean) {
  let template = readFileSync('index.html', 'utf-8')
  if (isProduction) {
    template = template.replace(
      '/src/ssr/ClientEntry.tsx',
      manifest.getUrl('/index.js'),
    )
  }
  return template
}

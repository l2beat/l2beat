import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import timeout from 'connect-timeout'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import type { ViteDevServer } from 'vite'
import { rawEnv } from '~/env'
import type { RenderData, RenderOptions, RenderResult } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
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

export async function createDevServer(baseLogger: Logger) {
  const logger = baseLogger.for('HTTP Server')
  const app = express()

  const { createDevMiddleware } = await import('./createDevMiddleware')
  const vite = await createDevMiddleware(app)
  // Serve static assets (fonts, icons, images) that Vite doesn't handle
  app.use('/', express.static('./static'))

  const renderToHtml = async (data: RenderData, url: string) => {
    const mod = await vite.ssrLoadModule('/src/ssr/ServerEntry.tsx')
    const renderFn = mod.render as RenderFn
    const rendered = renderFn(data, url, {
      stylesheetUrl: '/src/styles/globals.css?direct',
    })

    const template = readFileSync('index.html', 'utf-8')
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

    return transformHtmlWithVite(vite, url, html)
  }

  app.use(timeout('25s'))
  app.use(SafeSendHandler)
  app.use(MetricsMiddleware())

  app.use('/', createMigratedProjectsRouter())
  app.use('/', createLegacyPathsRouter())
  app.use('/api/trpc', createTrpcRouter())
  app.use('/', createDevPageRouterMiddleware(vite, manifest, renderToHtml))
  app.use('/', createApiRouter())

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  const server = app.listen(port, () => {
    logger.info('Started', {
      port,
      url: `http://localhost:${port}`,
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

function transformHtmlWithVite(vite: ViteDevServer, url: string, html: string) {
  return vite.transformIndexHtml(url, html)
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

function createDevPageRouterMiddleware(
  vite: ViteDevServer,
  manifest: Manifest,
  renderToHtml: (data: RenderData, url: string) => Promise<string>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mod = await vite.ssrLoadModule('/src/pages/ServerPageRouter.ts')
      const createServerPageRouter =
        mod.createServerPageRouter as typeof import('../pages/ServerPageRouter').createServerPageRouter
      const router = createServerPageRouter(manifest, renderToHtml)
      return router(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}

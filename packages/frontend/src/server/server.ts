import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import compression from 'compression'
import timeout from 'connect-timeout'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import sirv from 'sirv'
import type { ViteDevServer } from 'vite'
import { rawEnv } from '~/env'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import type { RenderData, ServerRenderFunction } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
import { ErrorHandler } from './middlewares/ErrorHandler'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { SafeSendHandler } from './middlewares/SafeSendHandler'
import { createApiRouter } from './routers/ApiRouter'
import { createLegacyPathsRouter } from './routers/LegacyPathsRouter'
import { createMigratedProjectsRouter } from './routers/MigratedProjectsRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const port = process.env.PORT ?? 3000

type ServerOptions =
  | {
      dev: true
      app: express.Application
      vite: ViteDevServer
      render: ServerRenderFunction
      stylesheetUrl: string
    }
  | {
      dev: false
      app: express.Application
      render: ServerRenderFunction
      stylesheetUrl: string
    }

export function createServer(baseLogger: Logger, options: ServerOptions) {
  const logger = baseLogger.for('HTTP Server')
  const { app, render, stylesheetUrl } = options

  if (options.dev) {
    app.use('/', express.static('./static'))
  } else {
    app.use(compression())
    app.use(
      '/static',
      sirv('./dist/static', { maxAge: 31536000, immutable: true }),
    )
    app.use('/', sirv('./static', { maxAge: 3600 }))
  }

  const renderToHtml = async (data: RenderData, url: string) => {
    const rendered = await render(data, url, {
      stylesheetUrl,
    })
    const template = options.dev
      ? readFileSync('index.html', 'utf-8')
      : getTemplate(manifest)

    let html = template
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

    if (options.dev) {
      html = await options.vite.transformIndexHtml(url, html)
    }

    return html
  }

  app.use(timeout('25s'))
  app.use(SafeSendHandler)
  app.use(MetricsMiddleware())

  app.use('/', createMigratedProjectsRouter())
  app.use('/', createLegacyPathsRouter())
  app.use('/api/trpc', createTrpcRouter())

  if (options.dev) {
    app.use(
      '/',
      createDevPageRouterMiddleware(options.vite, manifest, renderToHtml),
    )
  } else {
    app.use('/', createServerPageRouter(manifest, renderToHtml))
  }

  app.use('/', createApiRouter())

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  if (!options.dev) {
    app.use(ErrorHandler())
  }

  const server = app.listen(port, () => {
    logger.info('Started', {
      port,
      url: options.dev
        ? `http://localhost:${port}`
        : `Server running on port ${port}`,
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

function createDevPageRouterMiddleware(
  vite: ViteDevServer,
  _manifest: Manifest,
  renderToHtml: (data: RenderData, url: string) => Promise<string>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mod = await vite.ssrLoadModule('/src/pages/ServerPageRouter.ts')
      const createRouter =
        mod.createServerPageRouter as typeof import('../pages/ServerPageRouter').createServerPageRouter
      const router = createRouter(_manifest, renderToHtml)
      return router(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
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

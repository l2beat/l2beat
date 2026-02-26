import { readFileSync } from 'node:fs'
import type { Logger } from '@l2beat/backend-tools'
import timeout from 'connect-timeout'
import express from 'express'
import type { ViteDevServer } from 'vite'
import { rawEnv } from '~/env'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import type { RenderData } from '../ssr/types'
import { manifest } from '../utils/Manifest'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { SafeSendHandler } from './middlewares/SafeSendHandler'
import { createApiRouter } from './routers/ApiRouter'
import { createLegacyPathsRouter } from './routers/LegacyPathsRouter'
import { createMigratedProjectsRouter } from './routers/MigratedProjectsRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const port = process.env.PORT ?? 3000
const template = readFileSync('index.html', 'utf-8')

type RenderResult = {
  html: string
  head: string
}

type RenderFn = (data: RenderData, url: string) => RenderResult

let vite: ViteDevServer | undefined

export async function createDevServer(logger: Logger) {
  logger = logger.for('HTTP Server')

  const app = express()
  const { createDevMiddleware } = await import('./createDevMiddleware')
  vite = await createDevMiddleware(app)

  // Serve static assets (fonts, icons, images) that Vite doesn't handle.
  app.use('/', express.static('./static'))

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
    } else {
      logger.error('Unhandled server error:', err)
      process.exit(1)
    }
  })
}

async function renderToHtml(data: RenderData, url: string) {
  const viteServer = getVite()
  const mod = await viteServer.ssrLoadModule('/src/ssr/ServerEntry.tsx')
  const renderFn = mod.render as RenderFn
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

  // In dev, the tailwind CLI isn't running so /index.css doesn't exist.
  // Use Vite's direct CSS request so the browser receives real CSS instead
  // of the JS proxy module that "/src/styles/globals.css" returns.
  const head = rendered.head.replace(
    /<link rel="stylesheet" href="\/index\.css"\s*\/?>/,
    '<link rel="stylesheet" href="/src/styles/globals.css?direct">',
  )

  const html = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', rendered.html)
    .replace(
      '<!--ssr-data-->',
      `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    )
    .replace('<!--env-data-->', `window.__ENV__=${JSON.stringify(envData)}`)

  return await viteServer.transformIndexHtml(url, html)
}

function getVite() {
  if (!vite) {
    throw new Error('Vite dev server is not initialized')
  }
  return vite
}

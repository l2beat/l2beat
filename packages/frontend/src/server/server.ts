import { readFileSync } from 'node:fs'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'
import { createServerPageRouter } from '../pages/ServerPageRouter'
import { render } from '../ssr/server-entry'
import { type RenderData } from '../ssr/types'
import { type Manifest, manifest } from '../utils/Manifest'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'
import { createApiRouter } from './routers/ApiRouter'
import { createTrpcRouter } from './routers/TrpcRouter'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT ?? 3000

const template = getTemplate(manifest)

export function createServer() {
  const app = express()
  if (isProduction) {
    app.use(compression())
    // TODO: immutable cache
    app.use(
      '/',
      sirv('./rewrite/dist/static', { maxAge: 31536000, immutable: true }),
    )
    // This is done to delay moving markdown to server side
    app.use('/', sirv('./rewrite/static', { maxAge: 3600 }))
  } else {
    app.use('/', express.static('./rewrite/static'))
  }

  app.use(MetricsMiddleware)

  app.use('/api/trpc', createTrpcRouter())
  app.use('/', createServerPageRouter(manifest, renderToHtml))
  app.use('/', createApiRouter())

  app.listen(port, () => {
    console.log(`[HTTP] Server started at http://localhost:${port}`)
  })
}

function renderToHtml(data: RenderData, url: string) {
  const rendered = render(data, url)
  const envData = Object.fromEntries(
    Object.entries(process.env)
      .map(([key, value]) => {
        if (!key.startsWith('NEXT_PUBLIC_') && key !== 'NODE_ENV') {
          return undefined
        }
        return [key, value] as const
      })
      .filter((x) => x !== undefined),
  )
  return template
    .replace(`<!--app-head-->`, rendered.head)
    .replace(`<!--app-html-->`, rendered.html)
    .replace(
      `<!--ssr-data-->`,
      `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    )
    .replace(`<!--env-data-->`, `window.__ENV__=${JSON.stringify(envData)}`)
}

function getTemplate(manifest: Manifest) {
  let template = readFileSync('rewrite/index.html', 'utf-8')
  template = template.replace('/index.js', manifest.getUrl('/index.js'))
  return template
}

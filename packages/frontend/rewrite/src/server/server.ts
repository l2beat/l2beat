import { readFileSync } from 'node:fs'
import * as trpcExpress from '@trpc/server/adapters/express'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'
import { appRouter } from '~/server/api/root'
import { type Manifest, manifest } from '../../../src/utils/Manifest'
import { ServerPageRouter } from '../pages/ServerPageRouter'
import { render } from '../ssr/server-entry'
import { type RenderData } from '../ssr/types'
import { MetricsMiddleware } from './middlewares/MetricsMiddleware'

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

  ServerPageRouter(app, manifest, renderToHtml)

  const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    headers: new Headers(req.headers as Record<string, string>),
  })

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  )

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

function renderToHtml(data: RenderData, url: string) {
  const rendered = render(data, url)
  const envData = Object.fromEntries(
    Object.entries(process.env)
      .map(([key, value]) => {
        if (!key.startsWith('NEXT_PUBLIC_')) {
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

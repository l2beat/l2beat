import './dotenv'

import * as trpcExpress from '@trpc/server/adapters/express'
import compression from 'compression'
import express from 'express'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sirv from 'sirv'
import { appRouter } from '~/server/api/root'
import { type Manifest, getManifest } from './common/Manifest'
import { ServerPageRouter } from './pages/ServerPageRouter'
import { type RenderData, render } from './ssr/server'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT ?? 3000

const manifest = getManifest(isProduction, join(process.cwd(), 'rewrite'))
const template = getTemplate(manifest)
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
  app.use((req, res, next) => {
    const start = process.hrtime()
    res.on('finish', () => {
      const diff = process.hrtime(start)
      const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2) // ms with 2 decimal places
      console.log(`[${req.method}] ${req.originalUrl} - ${time} ms`)
    })
    next()
  })
}

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

function renderToHtml(data: RenderData, url: string) {
  const rendered = render(data, url)
  const sizeInBytes = JSON.stringify(data.ssr).length
  const sizeInKiB = (sizeInBytes / 1024).toFixed(2)
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
  console.log(`SSR data size: ${sizeInKiB} KiB`)
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
  const matches = ['/index.css', '/index.js', '/icon.svg']
  let template = readFileSync('rewrite/index.html', 'utf-8')
  for (const url of matches) {
    template = template.replace(url, manifest.getUrl(url))
  }
  return template
}

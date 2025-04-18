import compression from 'compression'
import express from 'express'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sirv from 'sirv'
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
  app.use('/static', sirv('./rewrite/dist/static', { extensions: [] }))
} else {
  app.use('/static', express.static('./rewrite/static'))
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

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

function renderToHtml(data: RenderData, url: string) {
  const rendered = render(data, url)
  const sizeInBytes = JSON.stringify(data.ssr).length
  const sizeInKiB = (sizeInBytes / 1024).toFixed(2)
  console.log(`SSR data size: ${sizeInKiB} KiB`)
  return template
    .replace(`<!--app-head-->`, rendered.head)
    .replace(`<!--app-html-->`, rendered.html)
    .replace(
      `<!--ssr-data-->`,
      `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    )
}

function getTemplate(manifest: Manifest) {
  let template = readFileSync('rewrite/index.html', 'utf-8')
  const matches = [...template.matchAll(/"\/static\/.*"/g)].map((x) =>
    x[0].slice(1, -1),
  )
  for (const url of matches) {
    template = template.replace(url, manifest.getUrl(url))
  }
  return template
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'
import { type Manifest, getManifest } from './common/Manifest'
import { ServerPageRouter } from './pages/ServerPageRouter'
import { type RenderData, render } from './ssr/server'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

const manifest = getManifest(isProduction, join(process.cwd(), 'rewrite'))
const template = getTemplate(manifest)

const app = express()

if (isProduction) {
  app.use(compression())
  // TODO: immutable cache
  app.use('/static', sirv('./rewrite/dist/static', { extensions: [] }))
} else {
  app.use('/static', express.static('./rewrite/static'))
}

ServerPageRouter(app, manifest, renderToHtml)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

function renderToHtml(data: RenderData) {
  const rendered = render(data)
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

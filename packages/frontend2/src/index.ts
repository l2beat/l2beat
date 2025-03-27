import { readFileSync } from 'node:fs'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'
import type { SsrData } from './app/App'
import { PageRouter } from './app/PageRouter'
import { render as ssrRender } from './ssr/entry.server'
import { getManifest, type Manifest } from './common/Manifest'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

const manifest = getManifest(isProduction, process.cwd())
const template = getTemplate(manifest)

const app = express()

if (isProduction) {
  app.use(compression())
  // TODO: immutable cache
  app.use('/static', sirv('./dist/static', { extensions: [] }))
} else {
  app.use('/static', express.static('./static'))
}

PageRouter(app, manifest, render)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

function render(ssrData: SsrData) {
  const rendered = ssrRender(ssrData)
  return template
    .replace(`<!--app-head-->`, rendered.head ?? '')
    .replace(`<!--app-html-->`, rendered.html ?? '')
    .replace(
      `<!--ssr-data-->`,
      `window.__SSR_DATA__=${JSON.stringify(ssrData)}`,
    )
}

function getTemplate(manifest: Manifest) {
  let template = readFileSync('index.html', 'utf-8')
  const matches = [...template.matchAll(/"\/static\/.*"/g)].map((x) =>
    x[0].slice(1, -1),
  )
  for (const url of matches) {
    template = template.replace(url, manifest.getUrl(url))
  }
  return template
}

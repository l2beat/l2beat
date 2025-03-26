import { readFileSync } from 'node:fs'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'
import type { SsrData } from './app/App'
import { AppRouter } from './app/AppRouter'
import { render as ssrRender } from './ssr/entry.server'

const isProduction = true // process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

const manifest = getManifest()
const template = getTemplate(manifest)

console.log(template)

const app = express()

if (isProduction) {
  app.use(compression())
  // TODO: immutable cache
  app.use('static', sirv('./dist/static', { extensions: [] }))
} else {
  // app.use('static', express.static('./static'))
}

AppRouter(app, render)

// Start http server
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

function getManifest(): Record<string, string> {
  if (!isProduction) {
    return {}
  }
  const content = readFileSync('dist/manifest.json', 'utf-8')
  return JSON.parse(content) as Record<string, string>
}

function getTemplate(manifest: Record<string, string>) {
  let template = readFileSync('index.html', 'utf-8')
  for (const [key, value] of Object.entries(manifest)) {
    console.log({ key, value })
    template = template.replace(key, value)
  }
  return template
}

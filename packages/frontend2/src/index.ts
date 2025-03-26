import fs from 'node:fs/promises'
import express from 'express'
import type { ViteDevServer } from 'vite'
import type { SsrData } from './app/App'
import { AppRouter } from './app/AppRouter'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: '/',
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(sirv('./dist/client', { extensions: [] }))
}

AppRouter(app, render)

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

async function render(url: string, ssrData: SsrData) {
  let template: string
  let render: (data: SsrData) => { html?: string; head?: string }
  if (!isProduction && vite) {
    // Always read fresh template in development
    template = await fs.readFile('./index.html', 'utf-8')
    template = await vite.transformIndexHtml(url, template)
    render = (
      await vite.ssrLoadModule('/src/ssr/entry.server.tsx', {
        fixStacktrace: true,
      })
    ).render
  } else {
    template = templateHtml
    const SERVER_ENTRY = '../dist/server/entry.server.js'
    render = (await import(SERVER_ENTRY)).render
  }

  const rendered = render(ssrData)

  const html = template
    .replace(`<!--app-head-->`, rendered.head ?? '')
    .replace(`<!--app-html-->`, rendered.html ?? '')
    .replace(
      `<!--ssr-data-->`,
      `window.__SSR_DATA__=${JSON.stringify(ssrData)}`,
    )
  return html
}

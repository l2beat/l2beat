import fs from 'node:fs/promises'
import express from 'express'
import type { ViteDevServer } from 'vite'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

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
    base,
  })
  app.use(vite.middlewares)
} else {
  // TODO: production?
  // const compression = (await import('compression')).default
  // const sirv = (await import('sirv')).default
  // app.use(compression())
  // app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template: string
    let render: (url: string) => { html?: string; head?: string }
    if (!isProduction && vite) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry.server.tsx')).render
    } else {
      template = templateHtml
      const SERVER_ENTRY = './dist/server/entry.server.js'
      render = (await import(SERVER_ENTRY)).render
    }

    const rendered = render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    if (e instanceof Error) {
      vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    } else {
      res.status(500).end(`${e}`)
    }
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

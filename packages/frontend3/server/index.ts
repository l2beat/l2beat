import express from 'express'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { initStaticAssets } from './assets'
import { DuckPage } from './pages/Duck'
import { HomePage } from './pages/Home'

const app = express()

app.get('/', (_req, res) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(createElement(HomePage))}`
  res.send(html)
})

app.get('/duck', (_req, res) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(createElement(DuckPage))}`
  res.send(html)
})

const assets = initStaticAssets()
app.use(
  assets.handlerPath,
  express.static(
    assets.staticPath,
    assets.enableCache ? { maxAge: '1y', immutable: true } : undefined,
  ),
)

const port = 2021
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`)
})

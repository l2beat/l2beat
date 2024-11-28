import express from 'express'
import { renderPage } from './Page'
import { initStaticAssets } from './assets'
import { DuckPage } from './pages/Duck'
import { HomePage } from './pages/Home'

const app = express()

app.get('/', (_req, res) => {
  res.send(renderPage(HomePage, {}))
})

app.get('/duck', (_req, res) => {
  res.send(renderPage(DuckPage, {}))
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

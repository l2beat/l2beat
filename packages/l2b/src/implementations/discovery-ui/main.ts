import express from 'express'
import { join } from 'path'

export function runDiscoveryUi() {
  const app = express()
  const port = 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  app.get('/', (_req, res) => {
    res.redirect('/ui')
  })

  app.get(['/ui', '/ui/*'], (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  app.use(express.static(STATIC_ROOT))

  app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })
}

import express from 'express'
import { join } from 'path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { App } from './App'
import { App2 } from './App2'

const app = express()

app.get('/', (_req, res) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(createElement(App))}`
  res.send(html)
})

app.get('/app2', (_req, res) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(createElement(App2))}`
  res.send(html)
})

app.use('/dev-static', express.static(join(__dirname, '../client/static')))

const port = 2021
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`)
})

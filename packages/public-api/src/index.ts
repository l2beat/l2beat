import { v } from '@l2beat/validate'
import { apiReference } from '@scalar/express-api-reference'
import express from 'express'
import { OpenApiExpress } from './OpenApiExpress'

const app = express()
const openapi = new OpenApiExpress(app)

app.get('/openapi', (_, res) => {
  res.json(openapi.getOpenApiSchema())
})

openapi.get(
  '/hello/:name',
  {
    params: v.object({ name: v.string() }),
    result: v.string(),
  },
  (req, res) => {
    res.json(`Hello ${req.params.name}`)
  },
)

openapi.get(
  '/hello',
  {
    query: v.object({ name: v.string() }),
    result: v.string(),
  },
  (req, res) => {
    console.log(!!req.query.name, req.query.name === '')
    res.json(`Hello ${req.query.name || 'World'}!`)
  },
)

app.get('/scalar', apiReference({ url: '/openapi' }))

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

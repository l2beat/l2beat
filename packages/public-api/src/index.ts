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
    tags: ['hello'],
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
    tags: ['hello'],
    query: v.object({ name: v.string() }),
    result: v.string(),
  },
  (req, res) => {
    console.log(!!req.query.name, req.query.name === '')
    res.json(`Hello ${req.query.name || 'World'}!`)
  },
)

openapi.get(
  '/test',
  {
    tags: ['test'],
    description: 'A test for no input',
    result: v.object({
      whats: v.literal('upp'),
    }),
  },
  (req, res) => {
    res.json({ whats: 'upp' })
  },
)

app.get('/scalar', apiReference({ url: '/openapi' }))

app.get(
  '/pet-store',
  apiReference({ url: 'https://petstore3.swagger.io/api/v3/openapi.json' }),
)

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

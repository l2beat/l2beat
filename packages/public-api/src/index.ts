import { apiReference } from '@scalar/express-api-reference'
import express from 'express'
import { OpenApi } from './OpenApi'
import { addProjectsRoutes } from './projects/routes'

function main() {
  const app = express()
  const openapi = new OpenApi(app)

  app.get('/openapi', (_, res) => {
    res.json(openapi.getOpenApiSchema())
  })

  addProjectsRoutes(openapi)

  app.get('/scalar', apiReference({ url: '/openapi' }))

  const port = 3000
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()

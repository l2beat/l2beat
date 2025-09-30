import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { OpenApi } from './OpenApi'
import { addProjectsRoutes } from './projects/routes'

function main() {
  const app = express()
  const openapi = new OpenApi(app)

  app.get('/openapi', (_, res) => {
    res.json(openapi.getOpenApiSchema())
  })

  addProjectsRoutes(openapi)

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      customSiteTitle: 'L2BEAT - Swagger UI',
      swaggerOptions: {
        url: '/openapi',
      },
    }),
  )

  const port = 3000
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()

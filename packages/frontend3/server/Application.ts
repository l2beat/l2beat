import express from 'express'
import { ApiRouter } from './routes/ApiRouter'
import { PageRouter } from './routes/PageRouter'
import { StaticRouter } from './routes/StaticRouter'

export class Application {
  start: () => void

  constructor() {
    const app = express()
    const routers = [ApiRouter(), PageRouter(), StaticRouter()]

    this.start = () => {
      for (const router of routers) {
        app.use(router)
      }

      const port = 8347 // BEAT
      app.listen(port, () => {
        console.log(`Listening on: http://localhost:${port}`)
      })
    }
  }
}

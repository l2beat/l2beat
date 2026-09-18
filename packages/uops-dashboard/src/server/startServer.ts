import type { Express } from 'express'

export function startServer(app: Express) {
  const port = Number(process.env.PORT ?? 3000)
  app.listen(port, () => {
    console.log(`UOPS dashboard listening on http://localhost:${port}`)
  })
}

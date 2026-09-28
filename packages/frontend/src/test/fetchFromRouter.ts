import type { AddressInfo } from 'node:net'
import express from 'express'

/** Serves the router on an ephemeral port so tests observe the real HTTP response, headers included. */
export async function fetchFromRouter(
  router: express.Router,
  path: string,
): Promise<Response> {
  const app = express()
  app.use('/', router)

  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address() as AddressInfo

  try {
    const response = await fetch(`http://localhost:${port}${path}`)
    // Buffered before the server closes, so callers can read it afterwards.
    const body = await response.arrayBuffer()
    return new Response(body, {
      status: response.status,
      headers: response.headers,
    })
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

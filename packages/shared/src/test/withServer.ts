import { createServer, type IncomingMessage, type ServerResponse } from 'http'
import type { AddressInfo } from 'net'

type Handler = (req: IncomingMessage, res: ServerResponse) => void

/**
 * Real loopback server for http tests. nock cannot intercept native fetch
 * (undici) and a fake would not exercise the timeout and body-streaming paths.
 */
export async function withServer<T>(
  handler: Handler,
  run: (url: string) => Promise<T>,
): Promise<T> {
  const server = createServer(handler)
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo
  try {
    return await run(`http://127.0.0.1:${port}`)
  } finally {
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

import type { Server } from 'http'
import type { AddressInfo } from 'net'

// Binds the first free port in [portFirst, portFirst + attemptCount), so a
// second `l2b ui` starts next to the first instead of crashing.
export async function listenOnFreePort(
  server: Server,
  portFirst: number,
  attemptCount: number,
): Promise<number> {
  if (!Number.isInteger(portFirst) || portFirst < 0) {
    throw new Error('Invalid port', { cause: { portFirst } })
  }
  if (!Number.isInteger(attemptCount) || attemptCount < 1) {
    throw new Error('Invalid attempt count', { cause: { attemptCount } })
  }

  for (let attempt = 0; attempt < attemptCount; attempt++) {
    const port = portFirst + attempt
    const error = await tryListen(server, port)
    if (error === undefined) {
      // Port 0 asks the OS for any free port, so report the one it bound.
      return (server.address() as AddressInfo).port
    }
    if (error.code !== 'EADDRINUSE') {
      throw error
    }
  }
  throw new Error('No free port', { cause: { portFirst, attemptCount } })
}

function tryListen(
  server: Server,
  port: number,
): Promise<NodeJS.ErrnoException | undefined> {
  return new Promise((resolve) => {
    const onError = (error: NodeJS.ErrnoException) => {
      server.off('listening', onListening)
      resolve(error)
    }
    const onListening = () => {
      server.off('error', onError)
      resolve(undefined)
    }
    server.once('error', onError)
    server.once('listening', onListening)
    server.listen(port)
  })
}

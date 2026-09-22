import type { Server } from 'node:http'
import type { Logger } from './logger/Logger'

// Node runs as PID 1 in our containers, where the kernel ignores the default
// SIGTERM action. Without an explicit handler `docker stop` waits the full
// grace period (30s on Coolify) on every deploy before killing the process.
export function exitOnShutdownSignal(
  logger: Logger,
  server?: Server,
  forceExitAfterMs = 5_000,
) {
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      logger.info(`Received ${signal}, shutting down`)
      if (server) {
        server.close(() => process.exit(0))
      } else {
        process.exit(0)
      }
      setTimeout(() => process.exit(0), forceExitAfterMs).unref()
    })
  }
}

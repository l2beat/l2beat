import type { TokenDatabase } from '@l2beat/database'
import { initTRPC } from '@trpc/server'
import type { Config } from '../config/Config'

export const createTRPCContext = (opts: {
  headers: Headers
  config: Config
  db: TokenDatabase
}) => {
  const { headers, config, db } = opts
  return {
    headers,
    config,
    db,
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

export const trcpRoot = initTRPC.context<Context>().create({
  transformer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause,
      },
    }
  },
})

export const router = trcpRoot.router

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = trcpRoot.createCallerFactory

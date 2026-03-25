import type { Database } from '@l2beat/database'
import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

export const createTRPCContext = (opts: { headers: Headers; db: Database }) => {
  const { headers, db } = opts

  return {
    headers,
    db,
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

export const trcpRoot = initTRPC.context<Context>().create({
  transformer: {
    serialize: SuperJSON.serialize,
    deserialize: SuperJSON.deserialize,
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

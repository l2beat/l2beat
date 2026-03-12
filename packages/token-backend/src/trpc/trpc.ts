import type { TokenDatabase } from '@l2beat/database'
import { initTRPC } from '@trpc/server'
import type { jwtVerify } from 'jose'
import type { Config } from '../config/Config'
import { getSession } from '../utils/getSession'

export const createTRPCContext = async (opts: {
  headers: Headers
  config: Config
  tokenDb: TokenDatabase
  jwtVerifyFn?: typeof jwtVerify
}) => {
  const { headers, config, tokenDb, jwtVerifyFn } = opts
  const session = await getSession(headers, config, { jwtVerifyFn })

  return {
    headers,
    tokenDb,
    session,
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

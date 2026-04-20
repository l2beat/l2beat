import type { Database } from '@l2beat/database'
import { initTRPC } from '@trpc/server'
import type { jwtVerify } from 'jose'
import type { InteropFeatureConfig } from '../../../../../config/Config'
import { getSession } from './utils/getSession'

export const createTRPCContext = async (opts: {
  headers: Headers
  db: Database
  dashboard: InteropFeatureConfig['dashboard']
  jwtVerifyFn?: typeof jwtVerify
}) => {
  const { headers, db, dashboard, jwtVerifyFn } = opts
  const session = await getSession(headers, dashboard, { jwtVerifyFn })

  return {
    headers,
    db,
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

export const createCallerFactory = trcpRoot.createCallerFactory

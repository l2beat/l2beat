import type { TokenDatabase } from '@l2beat/database'
import { initTRPC, TRPCError } from '@trpc/server'
import { jwtVerify } from 'jose'
import type { Config } from '../config/Config'
import { parseCookies } from '../utils/parseCookies'

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

export const protectedProcedure = (options?: {
  jwtVerifyFn?: typeof jwtVerify
}) =>
  trcpRoot.procedure.use(async (opts) => {
    const auth = opts.ctx.config.auth
    if (auth === false) {
      return opts.next({
        ctx: { email: 'dev@l2beat.com', permissions: ['read', 'write'] },
      })
    }

    // Otherwise, check the cookie
    const headers = opts.ctx.headers
    const cookie = headers.get('cookie') ?? ''
    const cookies = parseCookies(cookie)
    const token = cookies['CF_Authorization']
    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'missing authorization method',
      })
    }

    // If the cookie is a prefefined read-only token,
    // accept if options.acceptReadOnly is true
    if (token === opts.ctx.config.readOnlyAuthToken) {
      return opts.next({
        ctx: { email: 'dev-readonly@l2beat.com', permissions: ['read'] },
      })
    }

    // Otherwise check if it's a valid JWT cookie
    const { JWKS, teamDomain, aud } = auth
    const jwtVerifyFn = options?.jwtVerifyFn ?? jwtVerify

    let decodedToken
    try {
      decodedToken = await jwtVerifyFn(token, JWKS, {
        issuer: teamDomain,
        audience: aud,
      })
    } catch {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'JWT token verification failed',
      })
    }

    const { payload } = decodedToken
    return opts.next({
      ctx: { email: payload.email as string, permissions: ['read', 'write'] },
    })
  })

export const readOnlyProcedure = protectedProcedure().use((opts) => {
  if (!opts.ctx.permissions.includes('read')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient access',
    })
  }
  return opts.next()
})

export const readWriteProcedure = protectedProcedure().use((opts) => {
  if (!opts.ctx.permissions.includes('write')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient access',
    })
  }
  return opts.next()
})

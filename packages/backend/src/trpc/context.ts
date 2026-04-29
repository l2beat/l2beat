import type { Database } from '@l2beat/database'
import type { jwtVerify } from 'jose'
import { type AuthConfig, getSession, type Session } from './session'

export interface BaseContext {
  headers: Headers
  db: Database
  session: Session | undefined
}

export async function createTRPCContext(opts: {
  headers: Headers
  db: Database
  auth: AuthConfig
  jwtVerifyFn?: typeof jwtVerify
}): Promise<BaseContext> {
  const session = await getSession(opts.headers, opts.auth, {
    jwtVerifyFn: opts.jwtVerifyFn,
  })

  return {
    headers: opts.headers,
    db: opts.db,
    session,
  }
}

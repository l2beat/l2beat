import { jwtVerify } from 'jose'
import type { Config } from '../config/Config'
import { parseCookies } from './parseCookies'

export interface Session {
  email: string
  permissions: string[]
}

export async function getSession(
  headers: Headers,
  config: Config,
  options?: {
    jwtVerifyFn?: typeof jwtVerify
  },
): Promise<Session | undefined> {
  const auth = config.auth
  if (auth === false) {
    return { email: 'dev@l2beat.com', permissions: ['read', 'write'] }
  }

  // Otherwise, check the cookie
  const cookie = headers.get('cookie') ?? ''
  const cookies = parseCookies(cookie)
  const token = cookies['CF_Authorization'] ?? headers.get('Authorization')
  if (!token) {
    return
  }

  // If the cookie is a predefined read-only token
  if (token === config.readOnlyAuthToken) {
    return { email: 'dev-readonly@l2beat.com', permissions: ['read'] }
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
    return
  }

  const { payload } = decodedToken
  return {
    email: payload.email as string,
    permissions: ['read', 'write'],
  }
}

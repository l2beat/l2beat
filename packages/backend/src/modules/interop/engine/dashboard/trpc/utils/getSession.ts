import { jwtVerify } from 'jose'
import type { InteropFeatureConfig } from '../../../../../../config/Config'
import { parseCookies } from './parseCookies'

export interface Session {
  email: string
}

type DashboardConfig = InteropFeatureConfig['dashboard']

export async function getSession(
  headers: Headers,
  dashboard: DashboardConfig,
  options?: {
    jwtVerifyFn?: typeof jwtVerify
  },
): Promise<Session | undefined> {
  if (dashboard.auth === false) {
    return { email: 'dev@l2beat.com' }
  }

  const cookie = headers.get('cookie') ?? ''
  const cookies = parseCookies(cookie)

  const token = headers.get('Authorization') ?? cookies?.['CF_Authorization']

  if (!token) {
    return
  }

  const { JWKS, teamDomain, aud } = dashboard.auth
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
  }
}

import { jwtVerify } from 'jose'

export interface Session {
  email: string
}

export interface AuthCredentials {
  JWKS: Parameters<typeof jwtVerify>[1]
  aud: string
  teamDomain: string
  bypassAuthToken?: string
}

export type AuthConfig = AuthCredentials | false

export async function getSession(
  headers: Headers,
  auth: AuthConfig,
  options?: {
    jwtVerifyFn?: typeof jwtVerify
  },
): Promise<Session | undefined> {
  if (auth === false) {
    return { email: 'dev@l2beat.com' }
  }

  const cookie = headers.get('cookie') ?? ''
  const cookies = parseCookies(cookie)

  const token = headers.get('Authorization') ?? cookies?.['CF_Authorization']

  if (!token) {
    return
  }

  // Static back-office token shared between the deployed backoffice UI and
  // the staging/production backends. Lets the backoffice authenticate without
  // a Cloudflare Access JWT.
  if (auth.bypassAuthToken && token === auth.bypassAuthToken) {
    return { email: 'dev@l2beat.com' }
  }

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
  }
}

function parseCookies(
  cookieHeader: string,
): Record<string, string> | undefined {
  try {
    return Object.fromEntries(
      (cookieHeader ?? '')
        .split(';')
        .map((c) => c.trim().split('=').map(decodeURIComponent)),
    )
  } catch {}
}

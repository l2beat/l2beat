import { decodeIdToken } from 'arctic'
import { cookies } from 'next/headers'
import { google } from '~/server/auth/google'

import type { OAuth2Tokens } from 'arctic'
import { z } from 'zod'
import { env } from '~/env'
import { setSession } from '~/server/auth/cookie'

const claimsSchema = z.object({
  sub: z.string(),
  hd: z.string().optional(),
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string(),
  picture: z.string(),
})

// 12 hours
const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12)

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookieStore = cookies()
  const storedState = cookieStore.get('google_oauth_state')?.value ?? null
  const codeVerifier = cookieStore.get('google_code_verifier')?.value ?? null
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth?error=invalid-request',
      },
    })
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth?error=invalid-state',
      },
    })
  }

  let tokens: OAuth2Tokens
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier)
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth?error=invalid-request',
      },
    })
  }

  // Not checking for errors, because if the token is invalid, we might as well fail with 500
  const claims = claimsSchema.parse(decodeIdToken(tokens.idToken()))

  if (!claims.hd || !env.GOOGLE_ALLOWED_DOMAINS.includes(claims.hd)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth?error=domain',
      },
    })
  }

  if (!env.JWT_SECRET) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth?error=invalid-config',
      },
    })
  }

  await setSession(
    {
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
    },
    expiresAt,
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  })
}

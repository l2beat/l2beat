import * as jose from 'jose'
import { cookies } from 'next/headers'
import { env } from '~/env'
import { type Session, sessionSchema } from './session'

export async function setSession(
  session: Session,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies()
  const jwt = await new jose.SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(env.JWT_SECRET))

  cookieStore.set('session', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
    secure: env.NODE_ENV === 'production',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
    secure: env.NODE_ENV === 'production',
  })
}

export async function getSession(): Promise<Session | null> {
  const jwt = (await cookies()).get('session')?.value
  if (!jwt) return null
  try {
    const decoded = await jose.jwtVerify(
      jwt,
      new TextEncoder().encode(env.JWT_SECRET),
    )
    return sessionSchema.parse(decoded.payload)
  } catch {
    return null
  }
}

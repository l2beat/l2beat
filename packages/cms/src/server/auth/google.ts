import { Google } from 'arctic'
import { env } from '~/env'

export const google = new Google(
  env.GOOGLE_CLIENT_ID ?? '',
  env.GOOGLE_CLIENT_SECRET ?? '',
  env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${env.NEXT_PUBLIC_VERCEL_URL}/api/auth/callback`
    : 'http://localhost:3000/api/auth/callback',
)

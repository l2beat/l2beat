import { env } from '~/env'

export function getBaseUrl() {
  return (
    env.NEXT_PUBLIC_BASE_URL ??
    (env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000')
  )
}

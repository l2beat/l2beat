import { env } from '~/env'

export function getBaseUrl() {
  return env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:3000'
}

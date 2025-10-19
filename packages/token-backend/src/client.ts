import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/appRouter'

export function getTokenDbClient() {
  const url = getTrpcUrl()
  const headers = collectHeaders()

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        transformer: {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        headers() {
          return headers
        },
      }),
    ],
  })
}

function getTrpcUrl(): string {
  const explicitUrl = process.env['TOKEN_BACKEND_TRPC_URL']
  if (explicitUrl && explicitUrl.length > 0) {
    return explicitUrl
  }

  const baseUrl = process.env['TOKEN_BACKEND_URL']
  if (!baseUrl || baseUrl.length === 0) {
    throw new Error(
      'Set TOKEN_BACKEND_TRPC_URL or TOKEN_BACKEND_URL before running the script.',
    )
  }
  return `${baseUrl.replace(/\/$/, '')}/trpc`
}

function collectHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}

  const cookie = process.env['TOKEN_BACKEND_COOKIE']
  if (cookie && cookie.length > 0) {
    headers['cookie'] = cookie
    return headers
  }

  const cfToken = process.env['TOKEN_BACKEND_CF_TOKEN']
  if (cfToken && cfToken.length > 0) {
    headers['cookie'] = `CF_Authorization=${cfToken}`
  }

  return headers
}

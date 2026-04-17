const DEFAULT_TRPC_PROXY_TARGET = 'http://localhost:3007'
const TRPC_PATH = '/trpc'

export function getTrpcProxyTarget(trpcUrl: string | undefined) {
  const url = new URL(trpcUrl ?? DEFAULT_TRPC_PROXY_TARGET)
  url.pathname = stripTrailingTrpcPath(url.pathname)

  return url.toString()
}

function stripTrailingTrpcPath(pathname: string) {
  const normalizedPathname =
    pathname !== '/' && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname

  if (normalizedPathname === TRPC_PATH) {
    return '/'
  }

  if (normalizedPathname.endsWith(TRPC_PATH)) {
    return normalizedPathname.slice(0, -TRPC_PATH.length)
  }

  return normalizedPathname
}

export function buildInteropUrl(
  path: string,
  queryParams?: { first?: string; second?: string },
): string {
  if (!queryParams) {
    return path
  }

  const params = new URLSearchParams()

  if (queryParams.first) {
    params.set('first', queryParams.first)
  }
  if (queryParams.second) {
    params.set('second', queryParams.second)
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

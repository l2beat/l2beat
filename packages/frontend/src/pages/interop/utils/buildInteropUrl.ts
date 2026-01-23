export function buildInteropUrl(
  path: string,
  queryParams?: { from?: string[]; to?: string[] },
): string {
  if (!queryParams) {
    return path
  }
  const params = new URLSearchParams()
  if (queryParams.from && queryParams.from.length > 0) {
    params.set('from', queryParams.from.join(','))
  }
  if (queryParams.to && queryParams.to.length > 0) {
    params.set('to', queryParams.to.join(','))
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

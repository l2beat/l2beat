export function buildInteropUrl(
  path: string,
  queryParams?: { from?: string[]; to?: string[] },
  allChainIds?: string[],
): string {
  if (!queryParams) {
    return path
  }

  const params = new URLSearchParams()

  // Only add params when not all chains selected
  const allCount = allChainIds?.length ?? 0
  if (
    queryParams.from &&
    queryParams.from.length > 0 &&
    queryParams.from.length < allCount
  ) {
    params.set('from', queryParams.from.join(','))
  }
  if (
    queryParams.to &&
    queryParams.to.length > 0 &&
    queryParams.to.length < allCount
  ) {
    params.set('to', queryParams.to.join(','))
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

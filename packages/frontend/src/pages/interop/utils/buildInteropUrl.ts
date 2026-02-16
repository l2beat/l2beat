export function buildInteropUrl(
  path: string,
  selectedChains?: [string | null, string | null],
): string {
  if (!selectedChains || selectedChains.some((chain) => chain === null)) {
    return path
  }

  const params = new URLSearchParams()
  params.set('selectedChains', selectedChains.join(','))

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

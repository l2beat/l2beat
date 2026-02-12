import type { SelectedChains } from '~/server/features/scaling/interop/types'

export function buildInteropUrl(
  path: string,
  selectedChains?: SelectedChains,
): string {
  if (!selectedChains) {
    return path
  }

  const params = new URLSearchParams()
  params.set('selectedChains', selectedChains.join(','))

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

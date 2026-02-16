import { InteropSelectedChains } from './InteropSelectedChainsContext'

export function buildInteropUrl(
  path: string,
  selectedChains?: InteropSelectedChains,
): string {
  if (!selectedChains || !selectedChains.first || !selectedChains.second) {
    return path
  }

  const params = new URLSearchParams()
  params.set(
    'selectedChains',
    [selectedChains.first.id, selectedChains.second.id].join(','),
  )

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

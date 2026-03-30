import type { InteropMode, InteropSelection } from './types'

export function buildInteropUrl(
  path: string,
  selection: InteropSelection,
  mode: InteropMode,
): string {
  const params = new URLSearchParams()

  if (mode === 'public') {
    if (selection.from.length !== 1 || selection.to.length !== 1) {
      return path
    }

    params.set('selectedChains', [selection.from[0], selection.to[0]].join(','))
  } else {
    params.set('from', selection.from.join(','))
    params.set('to', selection.to.join(','))
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

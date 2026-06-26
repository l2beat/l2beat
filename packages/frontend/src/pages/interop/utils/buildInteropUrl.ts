import type { InteropSelection } from './types'

export function buildInteropUrl(
  path: string,
  selection: InteropSelection,
): string {
  if (selection.from.length === 0 && selection.to.length === 0) {
    return path
  }

  const params = new URLSearchParams()
  params.set('from', selection.from.join(','))
  params.set('to', selection.to.join(','))
  return `${path}?${params.toString()}`
}

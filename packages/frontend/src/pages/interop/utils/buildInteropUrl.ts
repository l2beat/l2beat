import { isSameInteropSelection } from './isSameInteropSelection'
import type { InteropSelection } from './types'

const EMPTY_SELECTION: InteropSelection = { from: [], to: [] }

export function buildInteropUrl(
  path: string,
  selection: InteropSelection,
  defaultSelection: InteropSelection = EMPTY_SELECTION,
): string {
  if (isSameInteropSelection(selection, defaultSelection)) {
    return path
  }

  const params = new URLSearchParams()
  params.set('from', selection.from.join(','))
  params.set('to', selection.to.join(','))
  return `${path}?${params.toString()}`
}

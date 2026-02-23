import { serializeDirectionalSelectionToQueryValue } from './directionalSelection'
import type { InteropSelection } from './getInitialInteropSelection'

export function buildInteropUrl(
  path: string,
  selection: InteropSelection,
  allChainIds: string[],
  defaultSelection: InteropSelection,
): string {
  const params = new URLSearchParams()

  const fromValue = serializeDirectionalSelectionToQueryValue(
    selection.from,
    allChainIds,
    defaultSelection.from,
  )
  if (fromValue !== undefined) {
    params.set('from', fromValue)
  }

  const toValue = serializeDirectionalSelectionToQueryValue(
    selection.to,
    allChainIds,
    defaultSelection.to,
  )
  if (toValue !== undefined) {
    params.set('to', toValue)
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

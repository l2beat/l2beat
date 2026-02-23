import type { InteropSelection } from './getInitialInteropSelection'
import { serializeMultiChainSelectionToQueryValue } from './multiChainSelection'

export function buildInteropUrl(
  path: string,
  selection: InteropSelection,
  allChainIds: string[],
  defaultSelection: InteropSelection,
): string {
  const params = new URLSearchParams()

  const fromValue = serializeMultiChainSelectionToQueryValue(
    selection.from,
    allChainIds,
    defaultSelection.from,
  )
  if (fromValue !== undefined) {
    params.set('from', fromValue)
  }

  const toValue = serializeMultiChainSelectionToQueryValue(
    selection.to,
    allChainIds,
    defaultSelection.to,
  )
  if (toValue !== undefined) {
    params.set('to', toValue)
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}

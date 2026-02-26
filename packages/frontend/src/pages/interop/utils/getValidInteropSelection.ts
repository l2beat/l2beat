import { getValidInteropChains } from './getValidInteropChains'
import type { InteropSelection } from './types'

export function getValidInteropSelection(
  selection: InteropSelection,
  allChainIds: string[],
): InteropSelection {
  return {
    from: getValidInteropChains(selection.from, allChainIds),
    to: getValidInteropChains(selection.to, allChainIds),
  }
}

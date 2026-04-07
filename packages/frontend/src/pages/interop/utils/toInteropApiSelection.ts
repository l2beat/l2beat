import type { InteropMode, InteropSelection } from './types'

export function toInteropApiSelection(
  selection: InteropSelection,
  mode: InteropMode,
): InteropSelection {
  if (mode !== 'public') {
    return selection
  }

  const sourceChain = selection.from[0]
  const destinationChain = selection.to[0]
  if (!sourceChain || !destinationChain || sourceChain === destinationChain) {
    return {
      from: [],
      to: [],
    }
  }

  const selectedChains = [sourceChain, destinationChain]

  return {
    from: selectedChains,
    to: selectedChains,
  }
}

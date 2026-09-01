import type { findSelected } from '../../../utils/findSelected'

type SelectedEntry = ReturnType<typeof findSelected>

export function hasSourceCode(selected: SelectedEntry) {
  return (
    selected !== undefined &&
    'implementationNames' in selected &&
    selected.implementationNames !== undefined
  )
}

export function getDefaultSourceIndex(sources: readonly { name: string }[]) {
  return sources.length > 1 ? 1 : 0
}

export function getDefaultSourceName(sources: readonly { name: string }[]) {
  return sources[getDefaultSourceIndex(sources)]?.name
}

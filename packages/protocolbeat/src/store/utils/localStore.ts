import type { State } from '../State'
import {
  StorageNodeLocations,
  decodeNodeState,
  encodeNodeState,
  getLayoutStorageKey,
} from './storageParsing'

export function persistNodeState(state: State): void {
  if (state.nodes.length <= 0) {
    return
  }
  const locations = encodeNodeState(state)
  localStorage.setItem(
    getLayoutStorageKey(state.projectId),
    JSON.stringify(locations),
  )
}

export function recallNodeState(
  projectId: string,
): StorageNodeLocations | undefined {
  const key = getLayoutStorageKey(projectId)
  const storage = localStorage.getItem(key)
  if (storage === null) {
    return undefined
  }

  const result = decodeNodeState(storage)
  if (result === undefined) {
    localStorage.removeItem(key)
  }
  return result
}

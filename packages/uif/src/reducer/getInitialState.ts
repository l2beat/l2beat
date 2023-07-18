import { IndexerState } from './types/IndexerState'

export function getInitialState(parentCount: number): IndexerState {
  return {
    status: 'init',
    height: 0,
    targetHeight: 0,
    safeHeight: 0,
    initializedSelf: false,
    waiting: false,
    tickScheduled: false,
    parents: Array.from({ length: parentCount }).map(() => ({
      safeHeight: 0,
      initialized: false,
      waiting: false,
    })),
    children: [],
  }
}

import type { IndexerState } from './types/IndexerState'

export function getInitialState(parentCount: number): IndexerState {
  return {
    status: 'init',
    height: 0,
    invalidateToHeight: 0,
    forceInvalidate: false,
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
    updateBlocked: false,
    invalidateBlocked: false,
    tickBlocked: false,
    configHash: undefined,
  }
}

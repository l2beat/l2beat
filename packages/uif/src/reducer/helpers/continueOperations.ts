import assert from 'node:assert'

import { IndexerEffect } from '../types/IndexerEffect'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function continueOperations(
  state: IndexerState,
  options: {
    updateFinished?: boolean
    forceInvalidate?: boolean
    updateFailed?: boolean
    invalidateFailed?: boolean
  } = {},
): IndexerReducerResult {
  const forceInvalidate =
    options.updateFailed ?? options.invalidateFailed ?? options.forceInvalidate

  const initializedParents = state.parents.filter((x) => x.initialized)
  if (initializedParents.length > 0 && !forceInvalidate) {
    const parentHeight = Math.min(
      ...initializedParents.map((x) => x.safeHeight),
    )

    if (
      state.targetHeight === state.height ||
      parentHeight < state.targetHeight
    ) {
      // We can change the target height in two different cases
      // 1. We are synced and the parent changed to a higher or lower height
      // 2. We are syncing and the parent changed to a lower height
      state = { ...state, targetHeight: parentHeight }
    }
  }

  const effects: IndexerEffect[] = []
  if (state.targetHeight < state.safeHeight || options.updateFinished) {
    const safeHeight = Math.min(state.targetHeight, state.height)

    if (safeHeight !== state.safeHeight) {
      effects.push({ type: 'SetSafeHeight', safeHeight })
    }

    if (safeHeight < state.safeHeight) {
      state = {
        ...state,
        safeHeight,
        waiting: true,
        children: state.children.map((c) => ({ ...c, ready: false })),
      }
    } else {
      state = { ...state, safeHeight }
    }
  }

  if (state.children.every((x) => x.ready)) {
    state = { ...state, waiting: false }
  }

  if (
    state.parents.some((x) => x.waiting) &&
    // TODO: there are cases where we are updating but below the safe height
    // but we ignore it right now for simplicity
    state.status !== 'updating' &&
    !state.waiting
  ) {
    const parentIndices: number[] = []
    state = {
      ...state,
      parents: state.parents.map((x, index) => {
        if (x.waiting) {
          parentIndices.push(index)
        }
        return { ...x, waiting: false }
      }),
    }

    effects.push({ type: 'NotifyReady', parentIndices })
  }

  if (
    !forceInvalidate &&
    state.targetHeight > state.height &&
    state.status === 'idle' &&
    !state.updateBlocked &&
    !state.invalidateBlocked
  ) {
    assert(state.parents.length > 0, 'Root indexer cannot update')

    return [
      { ...state, status: 'updating' },
      [...effects, { type: 'Update', targetHeight: state.targetHeight }],
    ]
  }

  if (options.invalidateFailed) {
    assert(state.invalidateBlocked, 'Invalidate should be blocked')
    effects.push({ type: 'ScheduleRetryInvalidate' })
  }

  if (
    state.invalidateBlocked ||
    (!forceInvalidate &&
      (state.status !== 'idle' ||
        state.targetHeight === state.height ||
        state.waiting ||
        (state.updateBlocked && state.targetHeight >= state.height)))
  ) {
    return [state, effects]
  }

  if (options.updateFailed) {
    assert(state.updateBlocked, 'Update should be blocked')
    effects.push({ type: 'ScheduleRetryUpdate' })
  }

  return [
    { ...state, status: 'invalidating' },
    [...effects, { type: 'Invalidate', targetHeight: state.targetHeight }],
  ]
}

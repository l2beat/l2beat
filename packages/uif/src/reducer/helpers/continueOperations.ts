import { assert } from '@l2beat/shared-pure'
import type { IndexerEffect } from '../types/IndexerEffect'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function continueOperations(
  state: IndexerState,
  options: {
    updateFinished?: boolean
    updateFailed?: boolean
    invalidateFailed?: boolean
  } = {},
): IndexerReducerResult {
  const initializedParents = state.parents.filter((x) => x.initialized)
  const parentHeight = Math.min(...initializedParents.map((x) => x.safeHeight))

  if (initializedParents.length > 0) {
    state = {
      ...state,
      invalidateToHeight: Math.min(state.invalidateToHeight, parentHeight),
    }
  }

  const effects: IndexerEffect[] = []

  if (state.invalidateToHeight < state.safeHeight || options.updateFinished) {
    const safeHeight = Math.min(state.invalidateToHeight, state.height)

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

  if (!state.initializedSelf) {
    return [state, effects]
  }

  if (options.updateFailed) {
    assert(!state.updateBlocked, 'Update should not be blocked')
    state = { ...state, updateBlocked: true }
    effects.push({ type: 'ScheduleRetryUpdate' })
  }

  if (options.invalidateFailed) {
    assert(!state.invalidateBlocked, 'Invalidate should not be blocked')
    state = { ...state, invalidateBlocked: true, forceInvalidate: true }
    effects.push({ type: 'ScheduleRetryInvalidate' })
  }

  const shouldInvalidate =
    state.forceInvalidate || state.invalidateToHeight < state.height
  const shouldUpdate =
    !shouldInvalidate &&
    initializedParents.length > 0 &&
    parentHeight > state.height

  if (shouldInvalidate) {
    if (state.invalidateBlocked || state.waiting || state.status !== 'idle') {
      return [state, effects]
    }
    assert(state.parents.length > 0, 'Root indexer cannot invalidate')
    return [
      { ...state, status: 'invalidating', forceInvalidate: false },
      [
        ...effects,
        { type: 'Invalidate', targetHeight: state.invalidateToHeight },
      ],
    ]
  }

  if (shouldUpdate) {
    if (state.updateBlocked || state.waiting || state.status !== 'idle') {
      return [state, effects]
    }
    assert(state.parents.length > 0, 'Root indexer cannot update')
    return [
      { ...state, status: 'updating' },
      [...effects, { type: 'Update', targetHeight: parentHeight }],
    ]
  }

  return [state, effects]
}

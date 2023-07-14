import assert from 'node:assert'

import { assertUnreachable } from './assertUnreachable'
import { IndexerAction } from './IndexerAction'
import { IndexerEffect } from './IndexerEffect'
import { IndexerState } from './IndexerState'

export type IndexerReducerResult = [IndexerState, IndexerEffect[]]

export function indexerReducer(
  state: IndexerState,
  action: IndexerAction,
): IndexerReducerResult {
  switch (action.type) {
    case 'Initialized': {
      assertStatus(state.status, 'init')

      const newState: IndexerState = {
        ...state,
        height: action.safeHeight,
        initializedSelf: true,
        children: Array.from({ length: action.childCount }).map(() => ({
          ready: true,
        })),
      }

      const result = finishInitialization(newState)
      return result ?? [newState, []]
    }
    case 'ParentUpdated': {
      const newState: IndexerState = {
        ...state,
        parents: state.parents.map((parent, index) =>
          index === action.index
            ? {
                ...parent,
                safeHeight: action.safeHeight,
                initialized: true,
                waiting: parent.initialized
                  ? action.safeHeight < parent.safeHeight
                  : false,
              }
            : parent,
        ),
      }

      const result = finishInitialization(newState)
      if (result) {
        return result
      }

      return continueOperations(newState)
    }
    case 'ChildReady': {
      const newState: IndexerState = {
        ...state,
        children: state.children.map((child, index) =>
          index === action.index ? { ...child, ready: true } : child,
        ),
      }
      return continueOperations(newState)
    }
    case 'UpdateSucceeded': {
      assertStatus(state.status, 'updating')
      return continueOperations(
        { ...state, status: 'idle', height: action.height },
        true,
      )
    }
    case 'UpdateFailed': {
      assertStatus(state.status, 'updating')
      // TODO: retry, exponential back-off
      // TODO: if parent waiting, notify ready.
      return [{ ...state, status: 'errored' }, []]
    }
    case 'InvalidateSucceeded': {
      assertStatus(state.status, 'invalidating')
      return continueOperations({
        ...state,
        status: 'idle',
        height: action.height,
      })
    }
    case 'InvalidateFailed': {
      assertStatus(state.status, 'invalidating')
      // TODO: retry, exponential back-off
      return [{ ...state, status: 'errored' }, []]
    }
    default:
      return assertUnreachable(action)
  }
}

function assertStatus(
  status: IndexerState['status'],
  expected: IndexerState['status'],
): void {
  assert(
    status === expected,
    'Invalid status. Expected ' + expected + ', got ' + status,
  )
}

function finishInitialization(
  state: IndexerState,
): IndexerReducerResult | undefined {
  if (state.status !== 'init') {
    return
  }
  if (state.initializedSelf && state.parents.every((x) => x.initialized)) {
    const height = Math.min(
      ...state.parents.map((x) => x.safeHeight),
      state.height,
    )

    return [
      {
        ...state,
        status: 'invalidating',
        safeHeight: height,
        targetHeight: height,
      },
      [
        { type: 'SetSafeHeight', safeHeight: height },
        { type: 'Invalidate', to: height },
      ],
    ]
  }
}

/*

Parent: 10
You: idle, h: 5, th: 5 -> th: 10, update + success -> h: 10, idle

Parent: 5 (was 10)
You: idle, h: 10, th: 10 -> th: 5, invalidate -> h: 5, idle

Parent: 5 (was 10)
You: updating, h: 5, th: 10 -> th: 5; update success (10) -> h: 10, invalidate -> h: 5, idle

Parent: 15 (was 10)
You: updating, h: 5, th: 10 -> th: 15; update success (10) -> h: 10, update + success -> h: 15, idle

*/

function continueOperations(
  state: IndexerState,
  updateFinished?: boolean,
): IndexerReducerResult {
  const initializedParents = state.parents.filter((x) => x.initialized)
  if (initializedParents.length > 0) {
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
  if (state.targetHeight < state.safeHeight || updateFinished) {
    const safeHeight = Math.min(state.targetHeight, state.height)
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
    effects.push({ type: 'SetSafeHeight', safeHeight })
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

  if (state.targetHeight > state.height && state.status === 'idle') {
    return [
      { ...state, status: 'updating' },
      [...effects, { type: 'Update', to: state.targetHeight }],
    ]
  }

  if (
    state.status !== 'idle' ||
    state.targetHeight === state.height ||
    state.waiting
  ) {
    return [state, effects]
  }

  return [
    { ...state, status: 'invalidating' },
    [...effects, { type: 'Invalidate', to: state.targetHeight }],
  ]
}

export function getInitialState(parentCount: number): IndexerState {
  return {
    status: 'init',
    height: 0,
    targetHeight: 0,
    safeHeight: 0,
    initializedSelf: false,
    waiting: false,
    parents: Array.from({ length: parentCount }).map(() => ({
      safeHeight: 0,
      initialized: false,
      waiting: false,
    })),
    children: [],
  }
}

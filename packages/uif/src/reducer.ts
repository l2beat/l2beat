import assert from 'node:assert'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState, StateAndEffects } from './BaseIndexerState'
import { Effect } from './Effect'
import { assertUnreachable } from './assertUnreachable'

export function baseIndexerReducer(
  state: BaseIndexerState,
  action: BaseIndexerAction,
): StateAndEffects {
  switch (action.type) {
    case 'Initialized': {
      assertStatus(state.status, 'init')

      const newState = {
        ...state,
        height: action.height,
        initializedSelf: true,
      }

      const result = finishInitialization(newState)
      return result ?? [newState, []]
    }
    case 'ParentUpdated': {
      const newState = {
        ...state,
        parentHeights: state.parentHeights.map((height, index) =>
          index === action.index ? action.height : height,
        ),
        initializedParents: state.initializedParents.map((initialized, index) =>
          index === action.index ? true : initialized,
        ),
      }

      const result = finishInitialization(newState)
      if (result) {
        return result
      }

      return newState.status === 'idle'
        ? idleToAction(newState)
        : [newState, []]
    }
    case 'UpdateSucceeded': {
      assertStatus(state.status, 'updating')
      return idleToAction({ ...state, status: 'idle', height: action.to }, [
        { type: 'UpdateHeight', to: action.to },
      ])
    }
    case 'UpdateFailed': {
      assertStatus(state.status, 'updating')
      // TODO: retry, exponential back-off
      return [{ ...state, status: 'errored' }, []]
    }
    case 'InvalidateSucceeded': {
      assertStatus(state.status, 'invalidating')
      return idleToAction({ ...state, status: 'idle', height: action.height })
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
  status: BaseIndexerState['status'],
  expected: BaseIndexerState['status'],
): void {
  assert(
    status === expected,
    'Invalid status. Expected ' + expected + ', got ' + status,
  )
}

function finishInitialization(
  state: BaseIndexerState,
): StateAndEffects | undefined {
  if (state.status === 'init') {
    if (state.initializedSelf && state.initializedParents.every((x) => x)) {
      const height = Math.min(...state.parentHeights, state.height)
      return [
        { ...state, status: 'invalidating' },
        [
          { type: 'UpdateHeight', to: height },
          { type: 'Invalidate', to: height },
        ],
      ]
    }
  }
}

function idleToAction(
  state: BaseIndexerState,
  suggestedEffects: Effect[] = [],
): StateAndEffects {
  const minParentHeight = Math.min(...state.parentHeights)
  const minHeight = Math.min(minParentHeight, state.height)

  if (minParentHeight > state.height) {
    return [
      { ...state, status: 'updating' },
      [...suggestedEffects, { type: 'Update', to: minParentHeight }],
    ]
  }

  if (minHeight === state.height) {
    return [state, suggestedEffects]
  }

  return [
    { ...state, status: 'invalidating' },
    [
      { type: 'UpdateHeight', to: minHeight },
      { type: 'Invalidate', to: minHeight },
    ],
  ]
}

export function getInitialState(parentCount: number): BaseIndexerState {
  return {
    status: 'init',
    height: 0,
    parentHeights: new Array<number>(parentCount).fill(0),
    initializedSelf: false,
    initializedParents: new Array<boolean>(parentCount).fill(false),
  }
}

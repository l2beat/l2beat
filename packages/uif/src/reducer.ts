import assert from 'node:assert'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState, StateAndEffects } from './BaseIndexerState'
import { Effect } from './Effect'

export function baseIndexerReducer(
  state: BaseIndexerState,
  action: BaseIndexerAction,
): StateAndEffects {
  switch (action.type) {
    case 'Initialized': {
      const newState = {
        ...state,
        height: action.height,
        initializedSelf: true,
      }

      if (newState.status === 'init') {
        if (
          newState.initializedSelf &&
          newState.initializedParents.every((x) => x)
        ) {
          const height = Math.min(...newState.parentHeights, newState.height)
          return [
            { ...newState, status: 'invalidating' },
            [
              { type: 'UpdateHeight', to: height },
              { type: 'Invalidate', to: height },
            ],
          ]
        }
      }

      return [newState, []]
    }
    case 'ParentUpdated': {
      const newState = {
        ...state,
        parentHeights: state.parentHeights.map((height, index) => {
          if (index === action.index) {
            return action.height
          }
          return height
        }),
        initializedParents: state.initializedParents.map(
          (initialized, index) => {
            if (index === action.index) {
              return true
            }
            return initialized
          },
        ),
      }

      if (newState.status === 'init') {
        if (
          newState.initializedSelf &&
          newState.initializedParents.every((x) => x)
        ) {
          const height = Math.min(...newState.parentHeights, newState.height)
          return [
            { ...newState, status: 'invalidating' },
            [
              { type: 'UpdateHeight', to: height },
              { type: 'Invalidate', to: height },
            ],
          ]
        }
      }

      return newState.status === 'idle'
        ? idleToAction(newState)
        : [newState, []]
    }
    case 'UpdateSucceeded': {
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
      return idleToAction({ ...state, status: 'idle', height: action.to }, [
        { type: 'UpdateHeight', to: action.to },
      ])
    }
    case 'UpdateFailed': {
      // TODO: retry
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
      return [{ ...state, status: 'errored' }, []]
    }
    case 'InvalidateSucceeded': {
      assert(
        state.status === 'invalidating',
        'Invalid status, expected invalidating, got ' + state.status,
      )
      return idleToAction({ ...state, status: 'idle', height: action.height })
    }
    case 'InvalidateFailed': {
      // TODO: we should probably retry first
      assert(
        state.status === 'invalidating',
        'Invalid status, expected invalidating, got ' + state.status,
      )
      return [{ ...state, status: 'errored' }, []]
    }
    default: {
      console.log(action)
      throw new Error('unreachable')
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

import assert from 'node:assert'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState, StateAndEffects } from './BaseIndexerState'

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
            // TODO: handle reorgs
            assert(
              height <= action.height,
              "Attempting to update parent height to a lower value than it's current height",
            )
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

      if (state.height < Math.min(...newState.parentHeights)) {
        return [
          { ...newState, status: 'updating' },
          [{ type: 'Update', to: Math.min(...newState.parentHeights) }],
        ]
      }
      return [newState, []]
    }
    case 'UpdateSucceeded': {
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
      if (action.to < Math.min(...state.parentHeights)) {
        return [
          { ...state, height: action.to },
          [{ type: 'Update', to: Math.min(...state.parentHeights) }],
        ]
      }
      return [
        { ...state, status: 'idle', height: action.to },
        [{ type: 'UpdateHeight', to: action.to }],
      ]
    }
    case 'UpdateFailed': {
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
      return [{ ...state, status: 'errored' }, []]
    }
    case 'InvalidateSucceeded':
      return [{ ...state, status: 'idle', height: action.height }, []]
    case 'InvalidateFailed':
      // TODO: handle invalidate failed
      return [{ ...state, status: 'idle', height: action.height }, []]
    default: {
      console.log(action)
      throw new Error('unreachable')
    }
  }
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

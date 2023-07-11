import assert from 'node:assert'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState, StateAndEffects } from './BaseIndexerState'

export function baseIndexerReducer(
  state: BaseIndexerState,
  action: BaseIndexerAction,
): StateAndEffects {
  switch (action.type) {
    case 'ParentUpdated':
      const newState = {
        ...state,
        parentHeights: state.parentHeights.map((height, index) => {
          if (index === action.index) {
            assert(
              height < action.height,
              "Attempting to update parent height to a lower value than it's current height",
            )
            return action.height
          }
          return height
        }),
      }

      if (state.height < Math.min(...newState.parentHeights)) {
        return [
          { ...newState, status: 'updating' },
          [{ type: 'Update', to: Math.min(...newState.parentHeights) }],
        ]
      }
      return [newState, []]

    case 'UpdateSucceeded':
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

    case 'UpdateFailed':
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
      return [{ ...state, status: 'errored' }, []]

    default:
      throw new Error('unreachable')
  }
}

export function getInitialState(parents: unknown[] = []): BaseIndexerState {
  return {
    height: 0,
    parentHeights: parents.map(() => 0),
    status: 'idle',
  }
}

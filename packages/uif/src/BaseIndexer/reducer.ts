import assert from 'node:assert'

export interface BaseIndexerState {
  height: number
  parentHeights: number[]
  batchSize: number
  status: 'idle' | 'updating' | 'invalidating' | 'errored'
}

export interface ParentUpdated {
  type: 'ParentUpdated'
  index: number
  height: number
}

export interface UpdateStarted {
  type: 'UpdateStarted'
  from: number
  to: number
}

export interface UpdateSucceeded {
  type: 'UpdateSucceeded'
  from: number
  to: number
}

export interface UpdateFailed {
  type: 'UpdateFailed'
  from: number
  to: number
}

export interface InvalidateSucceeded {
  type: 'InvalidateSucceeded'
  height: number
}

export interface InvalidateFailed {
  type: 'InvalidateFailed'
  height: number
}

export type BaseIndexerAction =
  | ParentUpdated
  | UpdateSucceeded
  | UpdateFailed
  | InvalidateSucceeded
  | InvalidateFailed
  | UpdateStarted

export interface UpdateEffect {
  type: 'Update'
  to: number
}

export interface UpdateHeightEffect {
  type: 'UpdateHeight'
  to: number
}

export type Effect = UpdateEffect | UpdateHeightEffect

export type StateAndEffects = [BaseIndexerState, Effect[]]

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

      if (newState.parentHeights.every((height) => height > state.height)) {
        return [
          newState,
          [{ type: 'Update', to: Math.min(...newState.parentHeights) }],
        ]
      }
      return [newState, []]

    case 'UpdateStarted':
      return [
        {
          ...state,
          status: 'updating',
        },
        [],
      ]

    case 'UpdateSucceeded':
      assert(
        state.status === 'updating',
        'Invalid status, expected updating, got ' + state.status,
      )
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

export function getInitialState(
  parents: unknown[] = [],
  batchSize = 5,
): BaseIndexerState {
  return {
    height: 0,
    parentHeights: parents.map(() => 0),
    batchSize,
    status: 'idle',
  }
}

export interface BaseIndexerState {
  height: number
  dependencyHeights: number[]
  batchSize: number
  status: 'idle' | 'updating' | 'invalidating'
}

interface DependencyUpdated {
  type: 'DependencyUpdated'
  index: number
  height: number
}

interface UpdateStarted {
  type: 'UpdateStarted'
  height: number
}

interface UpdateSucceeded {
  type: 'UpdateSucceeded'
  from: number
  to: number
}

interface UpdateFailed {
  type: 'UpdateFailed'
  from: number
  to: number
}

interface InvalidateSucceeded {
  type: 'InvalidateSucceeded'
  height: number
}

interface InvalidateFailed {
  type: 'InvalidateFailed'
  height: number
}

export type BaseIndexerAction =
  | DependencyUpdated
  | UpdateSucceeded
  | UpdateFailed
  | InvalidateSucceeded
  | InvalidateFailed
  | UpdateStarted

interface UpdateEffect {
  type: 'Update'
  to: number
}

export type Effect = UpdateEffect

export type StateAndEffects = [BaseIndexerState, Effect[]]

export function baseIndexerReducer(
  state: BaseIndexerState,
  action: BaseIndexerAction,
): StateAndEffects {
  switch (action.type) {
    case 'DependencyUpdated':
      const newState = {
        ...state,
        dependencyHeights: state.dependencyHeights.map((height, index) => {
          if (index === action.index) {
            return action.height
          }
          return height
        }),
      }

      if (newState.dependencyHeights.every((height) => height > state.height)) {
        return [
          newState,
          [{ type: 'Update', to: Math.min(...newState.dependencyHeights) }],
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

    default:
      throw new Error('unreachable')
  }
}

export function getInitialState(
  dependencies: unknown[] = [],
  batchSize = 5,
): BaseIndexerState {
  return {
    height: 0,
    dependencyHeights: dependencies.map(() => 0),
    batchSize,
    status: 'idle',
  }
}

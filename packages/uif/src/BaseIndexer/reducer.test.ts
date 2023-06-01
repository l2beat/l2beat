import { expect } from 'earl'

import {
  BaseIndexerAction,
  baseIndexerReducer,
  BaseIndexerState,
  getInitialState,
  StateAndEffects,
} from './reducer'

describe(baseIndexerReducer.name, () => {
  describe('DependencyUpdated', () => {
    it('should update a single dependency height', () => {
      const initialState = getInitialState(['a', 'b'])

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'DependencyUpdated',
          index: 0,
          height: 1,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        dependencyHeights: [1, 0],
        status: 'idle',
      })
      expect(effects).toEqual([])
    })

    it('should update a dependency and schedule effect when possible', () => {
      const initialState = getInitialState(['a', 'b'])

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'DependencyUpdated',
          index: 0,
          height: 1,
        },
        {
          type: 'DependencyUpdated',
          index: 1,
          height: 2,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        dependencyHeights: [1, 2],
        status: 'idle',
      })
      expect(effects).toEqual([{ type: 'Update', to: 1 }])
    })
  })

  describe('UpdateStarted', () => {
    it('should change state to updating', () => {
      const initialState = getInitialState()

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'UpdateStarted',
          height: 1,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        dependencyHeights: [],
        status: 'updating',
      })
      expect(effects).toEqual([])
    })
  })
})

function reduceWithBaseIndexerReducer(
  initialState: BaseIndexerState,
  actions: BaseIndexerAction[],
): StateAndEffects {
  return actions.reduce<StateAndEffects>(
    (stateAndEffects, action) => {
      const newStateAndEffects = baseIndexerReducer(stateAndEffects[0], action)

      return [
        newStateAndEffects[0], // last state
        [...stateAndEffects[1], ...newStateAndEffects[1]], // concat effects
      ]
    },
    [initialState, []],
  )
}

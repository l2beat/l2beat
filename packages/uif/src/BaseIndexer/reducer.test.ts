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

    it('should prevent an update that would lower current height', () => {
      const initialState = getInitialState(['a'])

      const fn = () =>
        reduceWithBaseIndexerReducer(initialState, [
          {
            type: 'DependencyUpdated',
            index: 0,
            height: 2,
          },
          {
            type: 'DependencyUpdated',
            index: 0,
            height: 1,
          },
        ])

      expect(fn).toThrow(
        "Attempting to update dependency height to a lower value than it's current height",
      )
    })
  })

  describe('UpdateStarted', () => {
    it('should change state to updating', () => {
      const initialState = getInitialState()

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'UpdateStarted',
          from: 0,
          to: 1,
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

  describe('UpdateSucceeded', () => {
    it('should update height and change state to idle', () => {
      const initialState = getInitialState()

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'UpdateStarted',
          from: 0,
          to: 1,
        },
        {
          type: 'UpdateSucceeded',
          from: 0,
          to: 1,
        },
      ])

      expect(state).toEqual({
        height: 1,
        batchSize: expect.a(Number),
        dependencyHeights: [],
        status: 'idle',
      })
      expect(effects).toEqual([])
    })
  })

  describe('UpdateFailed', () => {
    it('should change state to errored', () => {
      const initialState = getInitialState()

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'UpdateStarted',
          from: 1,
          to: 2,
        },
        {
          type: 'UpdateFailed',
          from: 1,
          to: 2,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        dependencyHeights: [],
        status: 'errored',
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

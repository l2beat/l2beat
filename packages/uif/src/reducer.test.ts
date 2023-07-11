import { expect } from 'earl'

import { baseIndexerReducer, getInitialState } from './reducer'
import { BaseIndexerState, StateAndEffects } from './BaseIndexerState'
import { BaseIndexerAction } from './BaseIndexerAction'

describe(baseIndexerReducer.name, () => {
  describe('DependencyUpdated', () => {
    it('should update a single dependency height', () => {
      const initialState = getInitialState(['a', 'b'])

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'ParentUpdated',
          index: 0,
          height: 1,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        parentHeights: [1, 0],
        status: 'idle',
      })
      expect(effects).toEqual([])
    })

    it('should update a dependency and schedule effect when possible', () => {
      const initialState = getInitialState(['a', 'b'])

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'ParentUpdated',
          index: 0,
          height: 1,
        },
        {
          type: 'ParentUpdated',
          index: 1,
          height: 2,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        parentHeights: [1, 2],
        status: 'idle',
      })
      expect(effects).toEqual([{ type: 'Update', to: 1 }])
    })

    it('should prevent an update that would lower current height', () => {
      const initialState = getInitialState(['a'])

      const fn = (): StateAndEffects =>
        reduceWithBaseIndexerReducer(initialState, [
          {
            type: 'ParentUpdated',
            index: 0,
            height: 2,
          },
          {
            type: 'ParentUpdated',
            index: 0,
            height: 1,
          },
        ])

      expect(fn).toThrow(
        "Attempting to update dependency height to a lower value than it's current height",
      )
    })
  })

  describe('UpdateSucceeded', () => {
    it('should update height and change state to idle', () => {
      const initialState = getInitialState()

      const [state, effects] = reduceWithBaseIndexerReducer(initialState, [
        {
          type: 'UpdateSucceeded',
          from: 0,
          to: 1,
        },
      ])

      expect(state).toEqual({
        height: 1,
        batchSize: expect.a(Number),
        parentHeights: [],
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
          type: 'UpdateFailed',
          from: 1,
          to: 2,
        },
      ])

      expect(state).toEqual({
        height: 0,
        batchSize: expect.a(Number),
        parentHeights: [],
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

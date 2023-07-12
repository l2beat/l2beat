import { expect } from 'earl'

import { IndexerAction } from './IndexerAction'
import {
  getInitialState,
  indexerReducer,
  IndexerReducerResult,
} from './indexerReducer'
import { IndexerState } from './IndexerState'

describe(indexerReducer.name, () => {
  describe('Initialized', () => {
    it('invalidates on startup', () => {
      const initState = getInitialState(0)
      const [state, effects] = reduceWithIndexerReducer(initState, [
        {
          type: 'Initialized',
          height: 0,
          childCount: 0,
        },
      ])

      expect(state).toEqual({
        ...initState,
        initializedSelf: true,
        status: 'invalidating',
      })
      expect(effects).toEqual([
        { type: 'SetSafeHeight', safeHeight: 0 },
        { type: 'Invalidate', to: 0 },
      ])
    })

    describe('parent not initialized', () => {
      it('only initializes', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'Initialized',
            height: 0,
            childCount: 0,
          },
        ])

        expect(state).toEqual({
          ...initState,
          initializedSelf: true,
        })
        expect(effects).toEqual([])
      })

      it('skips the height check', () => {
        const initState = getInitialState(1)
        const result = reduceWithIndexerReducer(initState, [
          {
            type: 'Initialized',
            height: 1,
            childCount: 0,
          },
        ])

        expect(result).toEqual([
          {
            ...initState,
            height: 1,
            initializedSelf: true,
          },
          [],
        ])
      })
    })
    describe('parent initialized', () => {
      it('invalidates to parent height', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'ParentUpdated',
            index: 0,
            height: 0,
          },
          {
            type: 'Initialized',
            height: 1,
            childCount: 0,
          },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'invalidating',
          height: 1,
          initializedSelf: true,
          parents: [{ height: 0, initialized: true, waiting: false }],
        })
        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 0 },
          { type: 'Invalidate', to: 0 },
        ])
      })
    })
  })
})

function reduceWithIndexerReducer(
  initialState: IndexerState,
  actions: IndexerAction[],
): IndexerReducerResult {
  return actions.reduce<IndexerReducerResult>(
    (stateAndEffects, action) => {
      const newStateAndEffects = indexerReducer(stateAndEffects[0], action)

      return [
        newStateAndEffects[0], // last state
        [...stateAndEffects[1], ...newStateAndEffects[1]], // concat effects
      ]
    },
    [initialState, []],
  )
}

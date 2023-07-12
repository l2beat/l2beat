import { expect } from 'earl'

import { IndexerAction } from './IndexerAction'
import {
  getInitialState,
  indexerReducer,
  IndexerReducerResult,
} from './indexerReducer'
import { IndexerState } from './IndexerState'

describe(indexerReducer.name, () => {
  describe('Initialization', () => {
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

    it('arrives to the idle state', () => {
      const initState = getInitialState(1)
      const [state] = reduceWithIndexerReducer(initState, [
        {
          type: 'Initialized',
          height: 0,
          childCount: 0,
        },
        {
          type: 'ParentUpdated',
          index: 0,
          to: 0,
        },
      ])

      const [idleState, idleEffects] = reduceWithIndexerReducer(state, [
        {
          type: 'InvalidateSucceeded',
          to: 0,
        },
      ])

      expect(idleState).toEqual({
        ...initState,
        initializedSelf: true,
        status: 'idle',
        parents: [{ height: 0, initialized: true, waiting: false }],
      })
      expect(idleEffects).toEqual([])
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
            to: 0,
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

      it('invalidates to parent height if parent initializes later', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'Initialized',
            height: 1,
            childCount: 0,
          },
          {
            type: 'ParentUpdated',
            index: 0,
            to: 0,
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

      it('waits for all the parents', () => {
        const initState = getInitialState(3)
        // initialize and 2 parents update
        const [state, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'Initialized',
            height: 1,
            childCount: 0,
          },
          {
            type: 'ParentUpdated' as const,
            index: 0,
            to: 0,
          },
          {
            type: 'ParentUpdated' as const,
            index: 1,
            to: 0,
          },
        ])

        // initializedSelf is true but one of the parents is not initialized
        expect(state).toEqual({
          ...initState,
          height: 1,
          initializedSelf: true,
          parents: [
            { height: 0, initialized: true, waiting: false },
            { height: 0, initialized: true, waiting: false },
            { height: 0, initialized: false, waiting: false },
          ],
        })
        expect(effects).toEqual([])

        const [state2, effects2] = reduceWithIndexerReducer(state, [
          {
            type: 'ParentUpdated' as const,
            index: 2,
            to: 0,
          },
        ])

        // when last parents updates, we invalidate and finish startup
        expect(state2).toEqual({
          ...initState,
          status: 'invalidating',
          height: 1,
          initializedSelf: true,
          parents: initState.parents.map((parent) => ({
            ...parent,
            initialized: true,
          })),
        })
        expect(effects2).toEqual([
          { type: 'SetSafeHeight', safeHeight: 0 },
          { type: 'Invalidate', to: 0 },
        ])
      })

      it('after invalidation updates to minimal parent height', () => {
        const initState = getInitialState(2)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'Initialized',
            height: 1,
            childCount: 0,
          },
          ...initState.parents.map((_, index) => ({
            type: 'ParentUpdated' as const,
            index,
            to: 2,
          })),
          {
            type: 'InvalidateSucceeded',
            to: 1,
          },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'updating',
          targetHeight: 2,
          height: 1,
          initializedSelf: true,
          parents: initState.parents.map((parent) => ({
            ...parent,
            initialized: true,
            height: 2,
          })),
        })

        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 1 },
          { type: 'Invalidate', to: 1 },
          { type: 'Update', to: 2 },
        ])
      })
    })
  })

  describe('Normal operation', () => {
    describe('parent updated', () => {
      it('updates to parent height', () => {
        const initState = getIdle()

        const [newState, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'ParentUpdated',
            index: 0,
            to: 2,
          },
        ])

        expect(newState).toEqual({
          ...initState,
          status: 'updating',
          targetHeight: 2,
          parents: [{ height: 2, initialized: true, waiting: false }],
        })

        expect(effects).toEqual([{ type: 'Update', to: 2 }])
      })

      it('invalidates to parent height', () => {
        const initState = getIdle()

        const [newState, effects] = reduceWithIndexerReducer(initState, [
          {
            type: 'ParentUpdated',
            index: 0,
            to: 0,
          },
        ])

        expect(newState).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 0,
          parents: [{ height: 0, initialized: true, waiting: false }],
        })

        expect(effects).toEqual([{ type: 'Invalidate', to: 0 }])
      })
    })
  })
})

function getIdle(): IndexerState {
  const initState = getInitialState(1)
  const [state] = reduceWithIndexerReducer(initState, [
    {
      type: 'Initialized',
      height: 1,
      childCount: 0,
    },
    {
      type: 'ParentUpdated',
      index: 0,
      to: 1,
    },
  ])

  const [idleState] = reduceWithIndexerReducer(state, [
    {
      type: 'InvalidateSucceeded',
      to: 1,
    },
  ])

  return idleState
}

function reduceWithIndexerReducer(
  initialState: IndexerState,
  actions: IndexerAction[],
): IndexerReducerResult {
  return actions.reduce<IndexerReducerResult>(
    ([state, effects], action) => {
      const [newState, newEffects] = indexerReducer(state, action)

      return [
        newState,
        [...effects, ...newEffects], // concat effects
      ]
    },
    [initialState, []],
  )
}

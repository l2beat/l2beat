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
        { type: 'Initialized', safeHeight: 0, childCount: 0 },
      ])

      expect(state).toEqual({
        ...initState,
        initializedSelf: true,
        // TODO: Should probably be invalidating
        status: 'idle',
      })
      expect(effects).toEqual([
        { type: 'SetSafeHeight', safeHeight: 0 },
        // TODO: Should probably be invalidating
        // { type: 'Invalidate', targetHeight: 0 },
      ])
    })

    it('arrives to the idle state', () => {
      const initState = getInitialState(1)
      const [state, effects] = reduceWithIndexerReducer(initState, [
        { type: 'Initialized', safeHeight: 0, childCount: 0 },
        { type: 'ParentUpdated', index: 0, safeHeight: 0 },
        { type: 'InvalidateSucceeded', targetHeight: 0 },
      ])

      expect(state).toEqual({
        ...initState,
        initializedSelf: true,
        status: 'idle',
        parents: [{ safeHeight: 0, initialized: true, waiting: false }],
      })
      expect(effects).toEqual([])
    })

    describe('parent not initialized', () => {
      it('only initializes', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 0, childCount: 0 },
        ])

        expect(state).toEqual({
          ...initState,
          initializedSelf: true,
        })
        expect(effects).toEqual([])
      })

      it('skips the height check', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 1, childCount: 0 },
        ])

        expect(state).toEqual({
          ...initState,
          height: 1,
          initializedSelf: true,
        })
        expect(effects).toEqual([])
      })
    })

    describe('parent initialized', () => {
      it('invalidates to parent height', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'ParentUpdated', index: 0, safeHeight: 100 },
          { type: 'Initialized', safeHeight: 200, childCount: 0 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 100,
          safeHeight: 100,
          height: 200,
          initializedSelf: true,
          parents: [{ safeHeight: 100, initialized: true, waiting: false }],
        })
        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 100 },
          { type: 'Invalidate', targetHeight: 100 },
        ])
      })

      it('invalidates to parent height if parent initializes later', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 200, childCount: 0 },
          { type: 'ParentUpdated', index: 0, safeHeight: 100 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 100,
          safeHeight: 100,
          height: 200,
          initializedSelf: true,
          parents: [{ safeHeight: 100, initialized: true, waiting: false }],
        })
        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 100 },
          { type: 'Invalidate', targetHeight: 100 },
        ])
      })

      it('invalidates to own height if parent is higher', () => {
        const initState = getInitialState(1)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 200, childCount: 0 },
          { type: 'ParentUpdated', index: 0, safeHeight: 300 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 200,
          safeHeight: 200,
          height: 200,
          initializedSelf: true,
          parents: [{ safeHeight: 300, initialized: true, waiting: false }],
        })
        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 200 },
          { type: 'Invalidate', targetHeight: 200 },
        ])
      })

      it('waits for all the parents', () => {
        const initState = getInitialState(3)
        // initialize and 2 parents update
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 100, childCount: 0 },
          { type: 'ParentUpdated', index: 0, safeHeight: 50 },
          { type: 'ParentUpdated', index: 1, safeHeight: 150 },
        ])

        // initializedSelf is true but one of the parents is not initialized
        expect(state).toEqual({
          ...initState,
          height: 100,
          initializedSelf: true,
          parents: [
            { safeHeight: 50, initialized: true, waiting: false },
            { safeHeight: 150, initialized: true, waiting: false },
            { safeHeight: 0, initialized: false, waiting: false },
          ],
        })
        expect(effects).toEqual([])

        const [state2, effects2] = reduceWithIndexerReducer(state, [
          { type: 'ParentUpdated', index: 2, safeHeight: 100 },
        ])

        // when last parents updates, we invalidate and finish startup
        expect(state2).toEqual({
          ...initState,
          status: 'invalidating',
          height: 100,
          targetHeight: 50,
          safeHeight: 50,
          initializedSelf: true,
          parents: [
            { safeHeight: 50, initialized: true, waiting: false },
            { safeHeight: 150, initialized: true, waiting: false },
            { safeHeight: 100, initialized: true, waiting: false },
          ],
        })
        expect(effects2).toEqual([
          { type: 'SetSafeHeight', safeHeight: 50 },
          { type: 'Invalidate', targetHeight: 50 },
        ])
      })

      it('after invalidation updates to minimal parent height', () => {
        const initState = getInitialState(2)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 50, childCount: 0 },
          { type: 'ParentUpdated', index: 0, safeHeight: 100 },
          { type: 'ParentUpdated', index: 1, safeHeight: 150 },
          { type: 'InvalidateSucceeded', targetHeight: 50 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'updating',
          safeHeight: 50,
          targetHeight: 100,
          height: 50,
          initializedSelf: true,
          parents: [
            { safeHeight: 100, initialized: true, waiting: false },
            { safeHeight: 150, initialized: true, waiting: false },
          ],
        })

        expect(effects).toEqual([{ type: 'Update', targetHeight: 100 }])
      })

      it('notifies ready when not started', () => {
        const initState = getInitialState(2)
        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'Initialized', safeHeight: 100, childCount: 0 },
          { type: 'ParentUpdated', index: 0, safeHeight: 100 },
          { type: 'ParentUpdated', index: 0, safeHeight: 50 },
          // The other parent is not initialized!
        ])

        expect(state).toEqual({
          ...initState,
          height: 100,
          initializedSelf: true,
          parents: [
            { safeHeight: 50, initialized: true, waiting: false },
            { safeHeight: 0, initialized: false, waiting: false },
          ],
        })

        expect(effects).toEqual([{ type: 'NotifyReady', parentIndices: [0] }])
      })
    })
  })

  describe('Normal operation', () => {
    describe('parent updated', () => {
      it('updates to parent height', () => {
        const initState = getAfterInit({
          safeHeight: 100,
          childCount: 0,
          parentHeights: [100, 150],
        })

        const [newState, effects] = reduceWithIndexerReducer(initState, [
          { type: 'ParentUpdated', index: 0, safeHeight: 200 },
        ])

        expect(newState).toEqual({
          ...initState,
          status: 'updating',
          targetHeight: 150,
          parents: [
            { safeHeight: 200, initialized: true, waiting: false },
            { safeHeight: 150, initialized: true, waiting: false },
          ],
        })

        expect(effects).toEqual([{ type: 'Update', targetHeight: 150 }])
      })

      it('invalidates to parent height', () => {
        const initState = getAfterInit({
          safeHeight: 100,
          childCount: 0,
          parentHeights: [100],
        })

        const [newState, effects] = reduceWithIndexerReducer(initState, [
          { type: 'ParentUpdated', index: 0, safeHeight: 50 },
        ])

        expect(newState).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 50,
          safeHeight: 50,
          parents: [{ safeHeight: 50, initialized: true, waiting: false }],
        })

        expect(effects).toEqual([
          { type: 'SetSafeHeight', safeHeight: 50 },
          { type: 'NotifyReady', parentIndices: [0] },
          { type: 'Invalidate', targetHeight: 50 },
        ])
      })

      it('wait for children before invalidating', () => {
        const initState = getAfterInit({
          safeHeight: 100,
          childCount: 1,
          parentHeights: [100],
        })

        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'ParentUpdated', index: 0, safeHeight: 50 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'idle',
          waiting: true,
          targetHeight: 50,
          safeHeight: 50,
          parents: [{ safeHeight: 50, initialized: true, waiting: true }],
          children: [{ ready: false }],
        })

        expect(effects).toEqual([{ type: 'SetSafeHeight', safeHeight: 50 }])

        const [state2, effects2] = reduceWithIndexerReducer(state, [
          { type: 'ChildReady', index: 0 },
        ])

        expect(state2).toEqual({
          ...initState,
          status: 'invalidating',
          targetHeight: 50,
          safeHeight: 50,
          parents: [{ safeHeight: 50, initialized: true, waiting: false }],
        })

        expect(effects2).toEqual([
          { type: 'NotifyReady', parentIndices: [0] },
          { type: 'Invalidate', targetHeight: 50 },
        ])
      })
    })

    describe('parent waiting', () => {
      it('dispatches notify ready when finished updating', () => {
        const initState = getAfterInit({
          safeHeight: 100,
          childCount: 0,
          parentHeights: [100],
        })

        const [state, effects] = reduceWithIndexerReducer(initState, [
          { type: 'ParentUpdated', index: 0, safeHeight: 200 },
        ])

        expect(state).toEqual({
          ...initState,
          status: 'updating',
          targetHeight: 200,
          parents: [{ safeHeight: 200, initialized: true, waiting: false }],
        })

        expect(effects).toEqual([{ type: 'Update', targetHeight: 200 }])

        const [state2, effects2] = reduceWithIndexerReducer(state, [
          { type: 'ParentUpdated', index: 0, safeHeight: 50 },
          { type: 'UpdateSucceeded', from: 100, targetHeight: 200 },
        ])

        expect(state2).toEqual({
          ...initState,
          status: 'invalidating',
          height: 200,
          safeHeight: 50,
          targetHeight: 50,
          parents: [{ safeHeight: 50, initialized: true, waiting: false }],
        })

        expect(effects2).toEqual([
          { type: 'SetSafeHeight', safeHeight: 50 },
          { type: 'NotifyReady', parentIndices: [0] },
          { type: 'Invalidate', targetHeight: 50 },
        ])
      })
    })
  })
})

function getAfterInit({
  safeHeight,
  childCount,
  parentHeights,
}: {
  safeHeight: number
  childCount: number
  parentHeights: number[]
}): IndexerState {
  const initState = getInitialState(parentHeights.length)
  const [state] = reduceWithIndexerReducer(initState, [
    { type: 'Initialized', safeHeight, childCount },
    ...parentHeights.map((safeHeight, index) => ({
      type: 'ParentUpdated' as const,
      index,
      safeHeight,
    })),
    {
      type: 'InvalidateSucceeded',
      targetHeight: Math.min(safeHeight, ...parentHeights),
    },
  ])

  return state
}

function reduceWithIndexerReducer(
  initialState: IndexerState,
  actions: IndexerAction[],
): IndexerReducerResult {
  return actions.reduce<IndexerReducerResult>(
    ([state], action) => indexerReducer(state, action),
    [initialState, []],
  )
}

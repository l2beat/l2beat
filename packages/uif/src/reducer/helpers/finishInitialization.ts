import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function finishInitialization(
  state: IndexerState,
): IndexerReducerResult | undefined {
  if (state.status !== 'init' || !state.initializedSelf) {
    return
  }

  if (state.parents.length === 0) {
    return [
      {
        ...state,
        status: 'idle',
        safeHeight: state.height,
        invalidateToHeight: state.height,
      },
      [{ type: 'SetSafeHeight', safeHeight: state.height }],
    ]
  }

  if (state.parents.every((x) => x.initialized)) {
    const parentHeight = Math.min(...state.parents.map((x) => x.safeHeight))
    const height = Math.min(parentHeight, state.height)

    return [
      {
        ...state,
        status: 'invalidating',
        safeHeight: height,
        invalidateToHeight: height,
      },
      [
        { type: 'SetSafeHeight', safeHeight: height },
        { type: 'Invalidate', targetHeight: height },
      ],
    ]
  }
}

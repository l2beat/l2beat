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
        targetHeight: state.height,
      },
      [{ type: 'SetSafeHeight', safeHeight: state.height }],
    ]
  }

  if (state.parents.every((x) => x.initialized)) {
    const height = Math.min(
      ...state.parents.map((x) => x.safeHeight),
      state.height,
    )

    return [
      {
        ...state,
        status: 'invalidating',
        safeHeight: height,
        targetHeight: height,
      },
      [
        { type: 'SetSafeHeight', safeHeight: height },
        { type: 'Invalidate', targetHeight: height },
      ],
    ]
  }
}

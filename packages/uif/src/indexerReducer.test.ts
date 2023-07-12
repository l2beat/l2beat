import { IndexerState } from './IndexerState'
import { indexerReducer } from './indexerReducer'
import { expect } from 'earl'

const emptyState: IndexerState = {
  status: 'init' as const,
  height: 0,
  targetHeight: 0,
  safeHeight: 0,
  initializedSelf: false,
  parents: [],
  children: [],
}

describe(indexerReducer.name, () => {
  it('initializes', () => {
    const result = indexerReducer(
      {
        ...emptyState,
      },
      {
        type: 'Initialized',
        height: 0,
        childCount: 0,
      },
    )

    expect(result).toEqual([{ ...emptyState, initializedSelf: true }, []])
  })
})

import { expect } from 'earl'
import { clearSavedState } from './clearSavedState'

describe(clearSavedState.name, () => {
  it('clears saved state but keeps node layouts', () => {
    const items = new Map([
      ['discovery-app-selection-store-v1', '{"state":{"selected":"0xA"}}'],
      ['favorites', 'arbitrum'],
      ['layout/arbitrum', '{"version":4}'],
    ])
    const storage = {
      get length() {
        return items.size
      },
      key: (index: number) => [...items.keys()][index] ?? null,
      removeItem: (key: string) => {
        items.delete(key)
      },
    }

    clearSavedState(storage)

    expect([...items.keys()]).toEqual(['layout/arbitrum'])
  })
})

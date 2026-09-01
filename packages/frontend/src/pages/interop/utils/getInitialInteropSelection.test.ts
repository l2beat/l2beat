import { expect } from 'earl'
import {
  getInitialInteropSelection,
  type InteropSelectionQuery,
} from './getInitialInteropSelection'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(getInitialInteropSelection.name, () => {
  it('returns empty selection when params are missing', () => {
    const result = getInitialInteropSelection({
      query: undefined,
      interopChainsIds: CHAINS,
    })

    expect(result).toEqual({
      from: [],
      to: [],
    })
  })

  it('normalizes selection by filtering unknown and deduping', () => {
    const query: InteropSelectionQuery = {
      from: ['arbitrum', 'ethereum', 'unknown', 'arbitrum', ''],
      to: ['base', 'unknown', 'base', 'ethereum'],
    }

    const result = getInitialInteropSelection({
      query,
      interopChainsIds: CHAINS,
    })

    expect(result).toEqual({
      from: ['ethereum', 'arbitrum'],
      to: ['ethereum', 'base'],
    })
  })
})

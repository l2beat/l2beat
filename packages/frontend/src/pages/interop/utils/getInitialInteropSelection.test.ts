import { expect } from 'earl'
import {
  getInitialInteropSelection,
  type InteropSelectionQuery,
} from './getInitialInteropSelection'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(getInitialInteropSelection.name, () => {
  it('returns public pair from selectedChains query', () => {
    const query: InteropSelectionQuery = {
      selectedChains: ['ethereum', 'arbitrum'],
    }

    const result = getInitialInteropSelection({
      query,
      interopChainsIds: CHAINS,
      mode: 'public',
    })

    expect(result).toEqual({
      from: ['ethereum'],
      to: ['arbitrum'],
    })
  })

  it('returns empty public selection for invalid pair', () => {
    const query: InteropSelectionQuery = {
      selectedChains: ['ethereum', 'ethereum'],
    }

    const result = getInitialInteropSelection({
      query,
      interopChainsIds: CHAINS,
      mode: 'public',
    })

    expect(result).toEqual({
      from: [],
      to: [],
    })
  })

  it('defaults internal selection to all chains when params are missing', () => {
    const result = getInitialInteropSelection({
      query: undefined,
      interopChainsIds: CHAINS,
      mode: 'internal',
    })

    expect(result).toEqual({
      from: CHAINS,
      to: CHAINS,
    })
  })

  it('normalizes internal selection by filtering unknown and deduping', () => {
    const query: InteropSelectionQuery = {
      from: ['arbitrum', 'ethereum', 'unknown', 'arbitrum', ''],
      to: ['base', 'unknown', 'base', 'ethereum'],
    }

    const result = getInitialInteropSelection({
      query,
      interopChainsIds: CHAINS,
      mode: 'internal',
    })

    expect(result).toEqual({
      from: ['ethereum', 'arbitrum'],
      to: ['ethereum', 'base'],
    })
  })
})

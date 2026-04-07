import { expect } from 'earl'
import { parseInteropSelectionFromSearchParams } from './parseInteropSelectionFromSearchParams'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(parseInteropSelectionFromSearchParams.name, () => {
  it('parses search params using the same selection semantics', () => {
    const result = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams('selectedChains=ethereum,arbitrum'),
      interopChainsIds: CHAINS,
      mode: 'public',
    })

    expect(result).toEqual({
      from: ['ethereum'],
      to: ['arbitrum'],
    })
  })
})

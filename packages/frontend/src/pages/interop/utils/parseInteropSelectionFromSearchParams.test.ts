import { expect } from 'earl'
import { parseInteropSelectionFromSearchParams } from './parseInteropSelectionFromSearchParams'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(parseInteropSelectionFromSearchParams.name, () => {
  it('parses from and to params', () => {
    const result = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams(
        'from=ethereum,arbitrum&to=ethereum,arbitrum',
      ),
      interopChainsIds: CHAINS,
    })

    expect(result).toEqual({
      from: ['ethereum', 'arbitrum'],
      to: ['ethereum', 'arbitrum'],
    })
  })

  it('returns empty selection when params are missing', () => {
    const result = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams(''),
      interopChainsIds: CHAINS,
    })

    expect(result).toEqual({
      from: [],
      to: [],
    })
  })

  it('returns default selection when params are missing', () => {
    const result = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams(''),
      interopChainsIds: CHAINS,
      defaultSelection: { from: CHAINS, to: CHAINS },
    })

    expect(result).toEqual({
      from: CHAINS,
      to: CHAINS,
    })
  })

  it('ignores default selection when params are present', () => {
    const result = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams('from=ethereum&to='),
      interopChainsIds: CHAINS,
      defaultSelection: { from: CHAINS, to: CHAINS },
    })

    expect(result).toEqual({
      from: ['ethereum'],
      to: [],
    })
  })
})

import { expect } from 'earl'
import type { TokenData } from '../types'
import { sortInteropTopItems } from './sortInteropTopItems'

describe(sortInteropTopItems.name, () => {
  it('sorts the full dataset by the requested column before pagination', () => {
    const items = [
      token({ id: 'usdc', symbol: 'USDC', volume: 50 }),
      token({ id: 'eth', symbol: 'ETH', volume: 200 }),
      token({ id: 'unknown', symbol: 'Unknown', volume: null }),
    ]

    const result = sortInteropTopItems(items, { id: 'volume', desc: true })

    expect(result.map((item) => item.id)).toEqual(['eth', 'usdc', 'unknown'])
  })

  it('keeps missing values last when sorting descending', () => {
    const items = [
      token({ id: 'unknown', symbol: 'Unknown', avgValue: null }),
      token({ id: 'eth', symbol: 'ETH', avgValue: 100 }),
      token({ id: 'usdc', symbol: 'USDC', avgValue: 50 }),
    ]

    const result = sortInteropTopItems(items, { id: 'avgValue', desc: true })

    expect(result.map((item) => item.id)).toEqual(['eth', 'usdc', 'unknown'])
  })

  it('sorts split average durations by the fastest configured split', () => {
    const items = [
      token({
        id: 'slow',
        symbol: 'SLOW',
        avgDuration: {
          type: 'split',
          splits: [
            { label: 'A', duration: 20 },
            { label: 'B', duration: 10 },
          ],
        },
      }),
      token({
        id: 'fast',
        symbol: 'FAST',
        avgDuration: {
          type: 'split',
          splits: [
            { label: 'A', duration: null },
            { label: 'B', duration: 5 },
          ],
        },
      }),
    ]

    const result = sortInteropTopItems(items, {
      id: 'avgDuration',
      desc: false,
    })

    expect(result.map((item) => item.id)).toEqual(['fast', 'slow'])
  })
})

function token(overrides: Partial<TokenData>): TokenData {
  return {
    id: 'token',
    symbol: 'TOKEN',
    issuer: null,
    iconUrl: '',
    topProtocol: undefined,
    volume: 0,
    transferCount: 0,
    avgDuration: null,
    avgValue: null,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    netMintedValue: undefined,
    flows: [],
    ...overrides,
  }
}

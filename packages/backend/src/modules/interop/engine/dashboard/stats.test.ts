import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { explore } from './stats'

describe(explore.name, () => {
  const start = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

  it('groups rows by (id, bridgeType, srcChain, dstChain)', () => {
    const rows = [
      ...flatRoute('across', 'ethereum', 'arbitrum'),
      ...flatRoute('across', 'ethereum', 'base'),
    ]
    const results = explore(rows)
    expect(results).toHaveLength(2)
    const arbitrum = results.find((r) => r.dstChain === 'arbitrum')
    const base = results.find((r) => r.dstChain === 'base')
    expect(arbitrum?.id).toEqual('across')
    expect(base?.id).toEqual('across')
  })

  it('forwards evaluator signals into interpretation text', () => {
    const results = explore(flatRoute('across', 'ethereum', 'arbitrum'))
    expect(results).toHaveLength(1)
    expect(
      results[0]?.interpretation.includes('Transfer count was flat'),
    ).toEqual(true)
    expect(results[0]?.evaluation.signals[0]?.kind).toEqual('flatLine')
  })

  it('exposes side mismatch through srcDstDiff.isSideMismatch', () => {
    const days = 14
    const rows = Array.from({ length: days }, (_, i) =>
      row(i, 'mismatched-route', 100, 2_000_000, 1_000_000),
    )
    const results = explore(rows)
    expect(results[0]?.srcDstDiff.isSideMismatch).toEqual(true)
    expect(results[0]?.evaluation.sideMismatch).not.toEqual(null)
  })

  it('omits rows whose baseline is below the count floor (no spam from 1->5)', () => {
    const rows = Array.from({ length: 14 }, (_, i) =>
      row(i, 'tiny', i === 13 ? 5 : 1),
    )
    const results = explore(rows)
    expect(results[0]?.interpretation).toEqual('')
    expect(results[0]?.evaluation.signals).toEqual([])
  })

  it('keeps the per-route keys and last-day metrics on the output row', () => {
    const results = explore(flatRoute('across', 'ethereum', 'arbitrum'))
    const result = results[0]
    expect(result?.bridgeType).toEqual('nonMinting')
    expect(result?.srcChain).toEqual('ethereum')
    expect(result?.dstChain).toEqual('arbitrum')
    expect(result?.counts.last).toEqual(100)
    expect(result?.srcVolume.valueUsd.last).toEqual(1_000_000)
    expect(result?.dstVolume.valueUsd.last).toEqual(1_000_000)
  })

  function row(
    offsetDays: number,
    id: string,
    transferCount: number,
    totalSrcValueUsd = 1_000_000,
    totalDstValueUsd = 1_000_000,
    srcChain = 'ethereum',
    dstChain = 'arbitrum',
  ) {
    return {
      day: start + offsetDays * UnixTime.DAY,
      id,
      bridgeType: 'nonMinting' as const,
      srcChain,
      dstChain,
      transferCount,
      identifiedCount: Math.round(transferCount * 0.95),
      totalSrcValueUsd,
      totalDstValueUsd,
    }
  }

  function flatRoute(id: string, srcChain: string, dstChain: string) {
    return Array.from({ length: 14 }, (_, i) =>
      row(i, id, 100, 1_000_000, 1_000_000, srcChain, dstChain),
    )
  }
})

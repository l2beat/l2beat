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
    expect(result?.counts.last).toEqual(300)
    expect(result?.srcVolume.valueUsd.last).toEqual(1_000_000)
    expect(result?.dstVolume.valueUsd.last).toEqual(1_000_000)
  })

  it('passes bridge totals to the evaluator for share-material route spikes', () => {
    // Arbitrum lane lands at $600K — below the $1M absolute floor — but the
    // bridge total (arbitrum $1.2M + base $4M = $5.2M) puts it at ~12% share,
    // above the 10% gate. Baseline (~$120K) clears the $100K/day floor.
    const baselineVolumes = [
      118_000, 122_000, 120_000, 119_000, 121_000, 120_000, 118_000, 122_000,
      119_000, 121_000, 120_000, 119_000, 121_000,
    ]
    const rows = [
      ...baselineVolumes.map((value, i) =>
        row(i, 'across', 100, value, value, 'ethereum', 'arbitrum'),
      ),
      row(13, 'across', 100, 600_000, 600_000, 'ethereum', 'arbitrum'),
      ...Array.from({ length: 14 }, (_, i) =>
        row(i, 'across', 100, 2_000_000, 2_000_000, 'ethereum', 'base'),
      ),
    ]

    const target = explore(rows).find((r) => r.dstChain === 'arbitrum')
    const srcSignal = target?.evaluation.signals.find(
      (signal) => signal.metric === 'srcVolume',
    )

    expect(srcSignal?.kind).toEqual('zScoreSpike')
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
    // 300/day clears the flat-line count relevance floor (250).
    return Array.from({ length: 14 }, (_, i) =>
      row(i, id, 300, 1_000_000, 1_000_000, srcChain, dstChain),
    )
  }
})

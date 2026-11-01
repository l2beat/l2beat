import type {
  InteropEventCounterpartVolumeRecord,
  InteropTransfersStatsRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildInteropCoverage, resolveCounterpartChain } from './coverage'

const CONFIG = {
  capturedChains: ['ethereum', 'base', 'arbitrum'],
  oneSidedChains: ['solana'],
}
const RANGE = { from: UnixTime(0), to: UnixTime(86400) }

describe(buildInteropCoverage.name, () => {
  it('merges one chain reported under different ids into a single row', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'Unknown_26', 60, 10),
        row('circle-gateway', 'Unknown_26', 50, 5),
        row('across', 'Unknown_5042', 1, 3),
        row('layerzero-v2-ofts', 'arc', 0, 2),
        row('ccip', 'Unknown_arc', 0.5, 1),
      ],
      [],
      CONFIG,
      RANGE,
    )

    expect(result.chains).toHaveLength(1)
    expect(result.chains[0]).toEqual({
      key: 'arc',
      label: 'arc',
      status: 'not-tracked',
      rawChains: ['Unknown_26', 'Unknown_5042', 'Unknown_arc', 'arc'],
      valueUsd: 111.5,
      events: 21,
      pricedEvents: 21,
      lastSeen: UnixTime(100),
      plugins: [
        { plugin: 'cctp-v2', valueUsd: 60, events: 10 },
        { plugin: 'circle-gateway', valueUsd: 50, events: 5 },
        { plugin: 'across', valueUsd: 1, events: 3 },
        { plugin: 'ccip', valueUsd: 0.5, events: 1 },
        { plugin: 'layerzero-v2-ofts', valueUsd: 0, events: 2 },
      ],
    })
  })

  it('leaves out captured and enabled one-sided chains', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'base', 10),
        row('ccip', 'Unknown_solana', 10),
        row('cctp-v2', ''),
      ],
      [],
      CONFIG,
      RANGE,
    )

    expect(result.chains).toEqual([])
  })

  it('tells unknown ids, untracked chains and disabled one-sided chains apart', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'Unknown_31', 3),
        row('across', 'Unknown_728126428', 2),
        row('layerzero-v2-ofts', 'ton', 1),
      ],
      [],
      CONFIG,
      RANGE,
    )

    expect(
      result.chains.map((c) => ({
        key: c.key,
        label: c.label,
        status: c.status,
      })),
    ).toEqual([
      {
        key: 'CCTP domain:31',
        label: 'Unknown CCTP domain 31',
        status: 'unknown-id',
      },
      { key: 'tron', label: 'tron', status: 'one-sided-disabled' },
      { key: 'ton', label: 'ton', status: 'not-tracked' },
    ])
  })

  it('computes coverage per plugin from transfers and uncovered events', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'Unknown_26', 30),
        row('cctp-v2', 'Unknown_8', 10),
        row('across', 'base', 5),
      ],
      [
        stats('cctp-v2', 60, 58, 4),
        stats('cctp-v2', 0, 0, 1),
        stats('across', 9, 10, 2),
      ],
      CONFIG,
      RANGE,
    )

    expect(result.plugins).toEqual([
      {
        plugin: 'cctp-v2',
        coveredValueUsd: 60,
        transfers: 5,
        uncoveredValueUsd: 40,
        uncoveredEvents: 2,
        coveragePct: 60,
        topMissing: [
          { label: 'arc', valueUsd: 30 },
          { label: 'sui', valueUsd: 10 },
        ],
      },
      {
        plugin: 'across',
        coveredValueUsd: 10,
        transfers: 2,
        uncoveredValueUsd: 0,
        uncoveredEvents: 0,
        coveragePct: 100,
        topMissing: [],
      },
    ])
    expect(result.coveredValueUsd).toEqual(70)
    expect(result.uncoveredValueUsd).toEqual(40)
  })
})

describe(resolveCounterpartChain.name, () => {
  it('reads numeric ids in the id space of the plugin', () => {
    expect(resolveCounterpartChain('cctp-v1', 'Unknown_9').key).toEqual('aptos')
    expect(resolveCounterpartChain('across', 'Unknown_9').key).toEqual(
      'chain id:9',
    )
    expect(resolveCounterpartChain('hyperlane', 'Unknown_6714')).toEqual({
      key: 'Hyperlane domain:6714',
      label: 'Unknown Hyperlane domain 6714',
      isNamed: false,
    })
  })
})

function row(
  plugin: string,
  counterpartChain: string,
  valueUsd = 0,
  events = 1,
): InteropEventCounterpartVolumeRecord {
  return {
    plugin,
    counterpartChain,
    events,
    unsupportedEvents: events,
    pricedEvents: events,
    valueUsd,
    lastTimestamp: UnixTime(100),
  }
}

function stats(
  plugin: string,
  srcValueSum: number,
  dstValueSum: number,
  count: number,
): InteropTransfersStatsRecord {
  return {
    plugin,
    type: `${plugin}.Transfer`,
    count,
    avgDuration: 0,
    srcValueSum,
    dstValueSum,
  }
}

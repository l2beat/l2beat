import type {
  InteropEventCounterpartVolumeRecord,
  InteropTransferPluginVolumeRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildIdNames,
  buildInteropCoverage,
  resolveCounterpartChain,
} from './coverage'

const CONFIG = {
  capturedChains: ['ethereum', 'base', 'arbitrum'],
  oneSidedChains: ['solana'],
  oneSidedPlugins: ['cctp-v2', 'across', 'ccip'],
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
      uncountedValueUsd: 111.5,
      uncountedEvents: 21,
      pricedUncountedEvents: 21,
      lastSeen: UnixTime(100),
      plugins: [
        {
          plugin: 'cctp-v2',
          supportsOneSided: true,
          uncountedValueUsd: 60,
          uncountedEvents: 10,
        },
        {
          plugin: 'circle-gateway',
          supportsOneSided: false,
          uncountedValueUsd: 50,
          uncountedEvents: 5,
        },
        {
          plugin: 'across',
          supportsOneSided: true,
          uncountedValueUsd: 1,
          uncountedEvents: 3,
        },
        {
          plugin: 'ccip',
          supportsOneSided: true,
          uncountedValueUsd: 0.5,
          uncountedEvents: 1,
        },
        {
          plugin: 'layerzero-v2-ofts',
          supportsOneSided: false,
          uncountedValueUsd: 0,
          uncountedEvents: 2,
        },
      ],
    })
  })

  it('leaves out captured chains and events without a counterpart', () => {
    const result = buildInteropCoverage(
      [row('cctp-v2', 'base', 10), row('cctp-v2', '')],
      [],
      CONFIG,
      RANGE,
    )

    expect(result.chains).toEqual([])
  })

  it('keeps enabled one-sided chains that have uncounted events', () => {
    const result = buildInteropCoverage(
      [row('mayan-forwarder', 'solana', 7, 2)],
      [],
      CONFIG,
      RANGE,
    )

    expect(
      result.chains.map((c) => ({
        key: c.key,
        status: c.status,
        uncountedValueUsd: c.uncountedValueUsd,
        plugins: c.plugins.map((p) => p.plugin),
      })),
    ).toEqual([
      {
        key: 'solana',
        status: 'one-sided',
        uncountedValueUsd: 7,
        plugins: ['mayan-forwarder'],
      },
    ])
  })

  it('tells unmapped ids, unknown ids, untracked and disabled one-sided chains apart', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'Unknown_6', 5),
        row('cctp-v2', 'Unknown_99', 4),
        row('across', 'Unknown_728126428', 3),
        row('layerzero-v2-ofts', 'ton', 2),
        row('cctp-v2', 'Unknown_5', 1),
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
      { key: 'unmapped:base', label: 'base', status: 'unmapped-id' },
      {
        key: 'CCTP domain:99',
        label: 'Unknown CCTP domain 99',
        status: 'unknown-id',
      },
      { key: 'tron', label: 'tron', status: 'one-sided-disabled' },
      { key: 'ton', label: 'ton', status: 'not-tracked' },
      { key: 'unmapped:solana', label: 'solana', status: 'unmapped-id' },
    ])
  })

  it('counts valued Wormhole core messages under the token bridge', () => {
    const result = buildInteropCoverage(
      [{ ...row('wormhole', 'near', 20, 5), pricedUnmatchedEvents: 2 }],
      [volume('wormhole-token-bridge', 80, 4)],
      CONFIG,
      RANGE,
    )

    expect(
      result.plugins.map((p) => ({
        plugin: p.plugin,
        uncoveredValueUsd: p.uncoveredValueUsd,
        uncoveredEvents: p.uncoveredEvents,
        coveragePct: p.coveragePct,
      })),
    ).toEqual([
      {
        plugin: 'wormhole-token-bridge',
        uncoveredValueUsd: 20,
        uncoveredEvents: 2,
        coveragePct: 80,
      },
      {
        plugin: 'wormhole',
        uncoveredValueUsd: 0,
        uncoveredEvents: 3,
        coveragePct: undefined,
      },
    ])
  })

  it('computes coverage per plugin from transfers and uncovered events', () => {
    const result = buildInteropCoverage(
      [
        row('cctp-v2', 'Unknown_26', 30),
        row('cctp-v2', 'Unknown_8', 10),
        row('cctp-v2', 'Unknown_6', 2),
        row('across', 'base', 5),
      ],
      [volume('cctp-v2', 60, 5), volume('across', 10, 2)],
      CONFIG,
      RANGE,
    )

    expect(result.plugins).toEqual([
      {
        plugin: 'cctp-v2',
        supportsOneSided: true,
        coveredValueUsd: 60,
        transfers: 5,
        uncoveredValueUsd: 42,
        uncoveredByStatus: {
          'unmapped-id': 2,
          'one-sided': 0,
          'one-sided-disabled': 0,
          'unknown-id': 0,
          'not-tracked': 40,
        },
        uncoveredEvents: 3,
        coveragePct: (100 * 60) / 102,
        topMissing: [
          { label: 'arc', valueUsd: 30 },
          { label: 'sui', valueUsd: 10 },
          { label: 'base (unmapped)', valueUsd: 2 },
        ],
      },
      {
        plugin: 'across',
        supportsOneSided: true,
        coveredValueUsd: 10,
        transfers: 2,
        uncoveredValueUsd: 0,
        uncoveredByStatus: {
          'unmapped-id': 0,
          'one-sided': 0,
          'one-sided-disabled': 0,
          'unknown-id': 0,
          'not-tracked': 0,
        },
        uncoveredEvents: 0,
        coveragePct: 100,
        topMissing: [],
      },
    ])
    expect(result.coveredValueUsd).toEqual(70)
    expect(result.uncoveredValueUsd).toEqual(42)
  })
})

describe(resolveCounterpartChain.name, () => {
  const idNames = buildIdNames({
    'layerzero-v2': [{ chain: 'rootstock', eid: 30333, chainId: 30 }],
    relay: [{ chain: 'anubis', chainId: 6714 }],
    ccip: {
      networks: [
        { chain: 'Unknown_wemix', chainSelector: '5142893604156789321' },
      ],
    },
  })

  it('reads numeric ids in the id space of the plugin', () => {
    expect(
      resolveCounterpartChain('cctp-v1', 'Unknown_9', idNames).key,
    ).toEqual('aptos')
    expect(resolveCounterpartChain('across', 'Unknown_9', idNames).key).toEqual(
      'chain id:9',
    )
    expect(
      resolveCounterpartChain('hyperlane', 'Unknown_9200', idNames),
    ).toEqual({
      key: 'Hyperlane domain:9200',
      label: 'Unknown Hyperlane domain 9200',
      isNamed: false,
      isUnmappedId: true,
    })
  })

  it('names ids from the stored configs', () => {
    expect(
      resolveCounterpartChain('stargate', 'Unknown_30333', idNames).key,
    ).toEqual('rootstock')
    // Hyperlane domains fall back to EVM chain ids
    expect(
      resolveCounterpartChain('hyperlane', 'Unknown_6714', idNames).key,
    ).toEqual('anubis')
    expect(
      resolveCounterpartChain('ccip', 'Unknown_5142893604156789321', idNames)
        .key,
    ).toEqual('wemix')
    expect(
      resolveCounterpartChain('across', 'Unknown_30', idNames).key,
    ).toEqual('rootstock')
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
    unmatchedEvents: events,
    unmatchedValueUsd: valueUsd,
    pricedUnmatchedEvents: events,
    lastTimestamp: UnixTime(100),
  }
}

function volume(
  plugin: string,
  volumeUsd: number,
  count: number,
): InteropTransferPluginVolumeRecord {
  return { plugin, count, volumeUsd }
}

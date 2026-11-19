import type {
  ChainHeadCursorRecord,
  LivePrivacyFlowEventRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  type LivePrivacyConfiguration,
  type LivePrivacyState,
  overlayLivePrivacyFlows,
} from './overlayLivePrivacyFlows'

/**
 * Methodology: block `n` of either chain was made `n` seconds after START.
 * The hourly data has the deposits of Ethereum up to block 100. The head of
 * Ethereum was read from block 90 up to block 160, and whoever asks has a
 * chart that ends at SINCE. The status of a chain has tests of its own
 */
const START = UnixTime.fromDate(new Date('2026-11-19T10:00:00Z'))
const NOW = START + 170
const SINCE = START + 50

describe(overlayLivePrivacyFlows.name, () => {
  it('shows the flows above the last block the hourly data has for their configuration', () => {
    const result = overlayLivePrivacyFlows(
      state({
        flows: [
          flow('deposits', 100),
          flow('deposits', 101),
          flow('deposits', 160),
          // of a configuration the hourly indexer no longer has
          flow('removed', 150),
        ],
      }),
      SINCE,
      NOW,
    )

    expect(result.flows.map((f) => f.blockNumber)).toEqual([101, 160])
    expect(result.leftOut).toEqual([])
    expect(result.chains).toEqual([
      { chain: 'ethereum', status: 'live', asOf: START + 160 },
    ])
  })

  it("cuts a bucket's deposits and withdrawals each at the block its own hours reach", () => {
    const result = overlayLivePrivacyFlows(
      state({
        configurations: [
          configuration('deposits', 100),
          // read again from an earlier hour, as after a change to it
          configuration('withdrawals', 95),
        ],
        flows: [
          flow('withdrawals', 96),
          flow('deposits', 96),
          flow('deposits', 120),
        ],
      }),
      SINCE,
      NOW,
    )

    expect(result.flows.map((f) => [f.configurationId, f.blockNumber])).toEqual(
      [
        ['withdrawals', 96],
        ['deposits', 120],
      ],
    )
  })

  const leftOut: [string, LivePrivacyConfiguration][] = [
    [
      'whose hours are not stored yet',
      {
        ...configuration('other', 100),
        sealedUntil: undefined,
        sealedBlock: undefined,
      },
    ],
    [
      'whose hourly data ends below where the flows stored at the head start',
      configuration('other', 80),
    ],
    [
      'whose hourly data ends below the time asked for',
      configuration('other', 40),
    ],
  ]
  for (const [name, other] of leftOut) {
    it(`leaves out a configuration ${name}, names its bucket, and still shows the others`, () => {
      const result = overlayLivePrivacyFlows(
        state({
          configurations: [
            configuration('deposits', 100),
            { ...other, bucketId: 'other bucket' },
          ],
          flows: [flow('deposits', 130), flow('other', 130)],
        }),
        SINCE,
        NOW,
      )

      expect(result.flows.map((f) => f.configurationId)).toEqual(['deposits'])
      expect(result.leftOut).toEqual(['other bucket'])
      expect(result.chains.map((c) => c.status)).toEqual(['live'])
    })
  }

  it('shows neither direction of a bucket when one of them is left out', () => {
    const result = overlayLivePrivacyFlows(
      state({
        configurations: [
          configuration('deposits', 100),
          // the bucket's withdrawals are being read again from the start
          configuration('withdrawals', 40),
        ],
        flows: [flow('deposits', 130), flow('withdrawals', 131)],
      }),
      SINCE,
      NOW,
    )

    expect(result.flows).toEqual([])
    expect(result.leftOut).toEqual(['bucket'])
  })

  it('shows nothing of a chain that is not live, and still shows the others', () => {
    const result = overlayLivePrivacyFlows(
      state({
        configurations: [
          configuration('deposits', 100),
          { ...configuration('base deposits', 100), chain: 'base' },
        ],
        cursors: [cursor('ethereum', 90, 160), cursor('base', 90, 160)],
        mismatched: ['ethereum'],
        flows: [
          flow('deposits', 130),
          { ...flow('base deposits', 140), chain: 'base' },
        ],
      }),
      SINCE,
      NOW,
    )

    expect(result.flows.map((f) => f.chain)).toEqual(['base'])
    expect(result.leftOut).toEqual([])
    expect(result.chains.map((c) => [c.chain, c.status])).toEqual([
      ['base', 'live'],
      ['ethereum', 'held back'],
    ])
  })
})

function state(
  overrides: {
    configurations?: LivePrivacyConfiguration[]
    cursors?: ChainHeadCursorRecord[]
    mismatched?: string[]
    flows?: LivePrivacyFlowEventRecord[]
  } = {},
): LivePrivacyState {
  const cursors = overrides.cursors ?? [cursor('ethereum', 90, 160)]
  const chains = ['ethereum', 'base']
  return {
    configurations: overrides.configurations ?? [
      configuration('deposits', 100),
    ],
    cursors: new Map(cursors.map((c) => [c.chain, c])),
    onHead: new Set(chains),
    heads: new Map(
      chains.map((chain) => [
        chain,
        { chain, number: 160, confirmedAt: START + 165 },
      ]),
    ),
    blockGaps: new Map(chains.map((chain) => [chain, 1])),
    matched: new Set(chains),
    mismatched: new Set(overrides.mismatched),
    flows: overrides.flows ?? [],
  }
}

/** Sealed up to the block, made as many seconds after START */
function configuration(
  id: string,
  sealedBlock: number,
): LivePrivacyConfiguration {
  return {
    id,
    chain: 'ethereum',
    bucketId: 'bucket',
    sealedUntil: START + sealedBlock,
    sealedBlock,
  }
}

function cursor(
  chain: string,
  sinceNumber: number,
  number: number,
): ChainHeadCursorRecord {
  return {
    indexerId: `live_privacy_flow::${chain}`,
    chain,
    sinceNumber,
    sinceTimestamp: START + sinceNumber,
    startedAt: START + sinceNumber,
    number,
    hash: `0x${number}`,
    timestamp: START + number,
  }
}

function flow(
  configurationId: string,
  blockNumber: number,
): LivePrivacyFlowEventRecord {
  return {
    configurationId,
    projectId: 'project',
    bucketId: 'bucket',
    chain: 'ethereum',
    direction: 'deposit',
    timestamp: START + blockNumber,
    blockNumber,
    blockHash: `0x${blockNumber}`,
    txHash: `0xtx${blockNumber}`,
    logIndex: 0,
    count: 1,
    amount: 100n,
  }
}

import type { Logger } from '@l2beat/backend-tools'
import type {
  ChainHeadCursorRecord,
  Database,
  LiveCheckRecord,
  LivePrivacyFlowEventRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { LivePrivacyFlowCheck } from './LivePrivacyFlowCheck'

/**
 * Methodology: the hours 10:00 to 11:00 are blocks 100 to 200, and it is
 * 12:00. The check answers through its log lines and the result it stores,
 * so they are what the tests read
 */
const FROM = UnixTime.fromDate(new Date('2026-11-18T10:00:00Z'))
const TO = FROM + UnixTime.HOUR
const NOW = TO + UnixTime.HOUR

describe(LivePrivacyFlowCheck.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('reports a match when the newest blocks hold the flows of the hours', async () => {
    const { check, logged, results } = setup({
      cursor: cursor(100, 250),
      live: [flow('a', 100), flow('a', 200)],
    })

    await check.run(['a'], FROM, TO, [flow('a', 100), flow('a', 200)])

    expect(logged()).toEqual([
      [
        'info',
        'Live flows match the hourly ones',
        { from: FROM, to: TO, blockFrom: 100, blockTo: 200, flows: 2 },
      ],
    ])
    expect(results()).toEqual([{ ...result('match'), compared: 2 }])
  })

  it('reports each flow only one of them has, and each stored in another block or with another time, count or amount', async () => {
    const { check, logged, results } = setup({
      cursor: cursor(100, 250),
      live: [
        flow('a', 120),
        { ...flow('a', 130), amount: 999n },
        { ...flow('a', 140), count: 0 },
        flow('a', 150),
        { ...flow('a', 160), txHash: '0xtx161' },
        { ...flow('a', 170), timestamp: FROM },
      ],
    })

    await check.run(['a'], FROM, TO, [
      flow('a', 110),
      flow('a', 130),
      flow('a', 140),
      flow('a', 150),
      flow('a', 161),
      flow('a', 170),
    ])

    expect(logged()).toEqual([
      [
        'error',
        'Live flows differ from the hourly ones',
        {
          from: FROM,
          to: TO,
          blockFrom: 100,
          blockTo: 200,
          total: 6,
          missing: 1,
          extra: 1,
          changed: 4,
          examples: [
            'a:0xtx110:0',
            'a:0xtx120:0',
            'a:0xtx130:0',
            'a:0xtx140:0',
            'a:0xtx161:0',
          ],
        },
      ],
    ])
    expect(results()).toEqual([
      { ...result('mismatch'), compared: 6, missing: 1, extra: 1, changed: 4 },
    ])
  })

  it('leaves out the flows of configurations the hours were not stored for', async () => {
    const { check, logged } = setup({
      cursor: cursor(100, 250),
      live: [flow('a', 100), flow('still catching up', 150)],
    })

    await check.run(['a'], FROM, TO, [flow('a', 100)])

    expect(logged().map(([level]) => level)).toEqual(['info'])
  })

  for (const [name, stored] of [
    ['start after the first block of the hours', cursor(101, 250)],
    ['end before the last block of the hours', cursor(100, 199)],
    ['were never stored', undefined],
  ] as const) {
    it(`reports the hours as not compared when the newest blocks ${name}`, async () => {
      const { check, logged, results } = setup({ cursor: stored, live: [] })

      await check.run(['a'], FROM, TO, [flow('a', 150)])

      expect(results()).toEqual([result('uncovered')])
      expect(logged()).toEqual([
        [
          'info',
          'Live flows do not cover the hours',
          {
            from: FROM,
            to: TO,
            blockFrom: 100,
            blockTo: 200,
            liveFrom: stored?.sinceNumber,
            liveTo: stored?.number,
          },
        ],
      ])
    })
  }

  it('compares nothing while the head no longer has the block the live flows were read up to', async () => {
    const { check, results } = setup({
      cursor: { ...cursor(100, 250), hash: '0xreplaced' },
      live: [flow('a', 150)],
    })

    await check.run(['a'], FROM, TO, [flow('a', 150)])

    expect(results()).toEqual([result('uncovered')])
  })

  it('stores no result for hours older than live flows are kept, as a new configuration catching up reads', async () => {
    const { check, results } = setup({ cursor: undefined, live: [] })
    time.setSystemTime((TO + 5 * UnixTime.HOUR) * 1000)

    await check.run(['a'], FROM - UnixTime.DAY, TO - UnixTime.DAY, [])

    expect(results()).toEqual([])
  })

  it('does not fail the hours when the comparison cannot be made', async () => {
    const { check, logged, results } = setup({
      cursor: cursor(100, 250),
      live: [],
      fail: new Error('Connection lost'),
    })

    await check.run(['a'], FROM, TO, [])

    expect(logged().map(([level, message]) => [level, message])).toEqual([
      ['warn', 'Live flows could not be compared'],
    ])
    // not left to an older match to stand for these hours
    expect(results()).toEqual([result('uncovered')])
  })

  function setup(stored: {
    cursor: ChainHeadCursorRecord | undefined
    live: LivePrivacyFlowEventRecord[]
    fail?: Error
  }) {
    const lines: unknown[][] = []
    const log = (level: string) =>
      mockFn((...args: unknown[]) => {
        lines.push([level, ...args])
      })
    const logger: Logger = mockObject<Logger>({
      for: () => logger,
      tag: () => logger,
      info: log('info'),
      warn: log('warn'),
      error: log('error'),
    })

    const results: LiveCheckRecord[] = []
    const db = mockDatabase({
      liveCheck: mockObject<Database['liveCheck']>({
        upsert: async (record) => {
          results.push(record)
        },
      }),
      privacyBlockTimestamp: mockObject<Database['privacyBlockTimestamp']>({
        findBlockNumberByChainAndTimestamp: async (_, timestamp) =>
          timestamp === FROM ? 100 : 200,
      }),
      // the head has every block under the hash `cursor()` gives it
      chainBlock: mockObject<Database['chainBlock']>({
        getByNumberRange: async (chain, number) => [
          {
            chain,
            number,
            hash: `0x${number}`,
            parentHash: `0x${number - 1}`,
            timestamp: FROM + number,
            logsBloom: null,
          },
        ],
      }),
      chainHeadCursor: mockObject<Database['chainHeadCursor']>({
        findByIndexerId: async (indexerId) =>
          indexerId === 'live_privacy_flow::ethereum'
            ? stored.cursor
            : undefined,
      }),
      livePrivacyFlowEvent: mockObject<Database['livePrivacyFlowEvent']>({
        getByChainInBlockRange: async (_, from, to) => {
          if (stored.fail) throw stored.fail
          return stored.live.filter(
            (f) => f.blockNumber >= from && f.blockNumber <= to,
          )
        },
      }),
    })

    return {
      check: new LivePrivacyFlowCheck({ chain: 'ethereum', db }, logger),
      logged: () => lines,
      results: () => results,
    }
  }
})

function result(status: LiveCheckRecord['status']): LiveCheckRecord {
  return {
    feature: 'privacy.flow',
    chain: 'ethereum',
    from: FROM,
    to: TO,
    status,
    compared: 0,
    missing: 0,
    extra: 0,
    changed: 0,
    checkedAt: NOW,
  }
}

function cursor(sinceNumber: number, number: number): ChainHeadCursorRecord {
  return {
    indexerId: 'live_privacy_flow::ethereum',
    chain: 'ethereum',
    sinceNumber,
    sinceTimestamp: FROM,
    startedAt: FROM,
    number,
    hash: `0x${number}`,
    timestamp: TO,
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
    timestamp: FROM + blockNumber,
    blockNumber,
    blockHash: `0x${blockNumber}`,
    txHash: `0xtx${blockNumber}`,
    logIndex: 0,
    count: 1,
    amount: 100n,
  }
}

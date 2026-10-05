import type {
  PrivacyAnonymitySetEventRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
} from './calculateAnonymitySets'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

const ENDPOINT = UnixTime.fromDate(new Date('2026-08-21T00:00:00Z'))

describe(calculateAnonymitySetHistory.name, () => {
  it('counts active notes individually and applies deposit, amount and expiry boundaries', () => {
    const events = [
      noteEvent(0, ENDPOINT - 30 * UnixTime.DAY, true, ENDPOINT, 10n),
      noteEvent(1, ENDPOINT - UnixTime.DAY, true, ENDPOINT + UnixTime.DAY, 10n),
      noteEvent(2, ENDPOINT - UnixTime.DAY, true, ENDPOINT + UnixTime.DAY, 9n),
      noteEvent(3, ENDPOINT - UnixTime.DAY, true, ENDPOINT - 1, 10n),
      noteEvent(
        4,
        ENDPOINT - 30 * UnixTime.DAY - 1,
        true,
        ENDPOINT + UnixTime.DAY,
        10n,
      ),
      noteEvent(5, ENDPOINT, true, ENDPOINT + UnixTime.DAY, 10n),
      {
        ...noteEvent(
          6,
          ENDPOINT - UnixTime.DAY,
          true,
          ENDPOINT + UnixTime.DAY,
          10n,
        ),
        configurationId: 'other',
      },
    ]
    expect(
      calculateAnonymitySetHistory(
        [],
        [series({ unit: 'note' })],
        [ENDPOINT],
        events,
      ),
    ).toEqual([[ENDPOINT, 2]])
  })

  it('removes an escape immediately, restores a challenged note, and keeps past counts intact', () => {
    const events = [
      noteEvent(
        0,
        ENDPOINT - 3 * UnixTime.DAY,
        true,
        ENDPOINT + UnixTime.DAY,
        10n,
      ),
      noteEvent(0, ENDPOINT - 2 * UnixTime.DAY, false),
      noteEvent(0, ENDPOINT - UnixTime.DAY, true),
      noteEvent(0, ENDPOINT, false),
    ]
    expect(
      calculateAnonymitySetHistory(
        [],
        [series({ unit: 'note' })],
        [
          ENDPOINT - 2 * UnixTime.DAY,
          ENDPOINT - UnixTime.DAY,
          ENDPOINT,
          ENDPOINT + 1,
        ],
        events,
      ),
    ).toEqual([
      [ENDPOINT - 2 * UnixTime.DAY, 1],
      [ENDPOINT - UnixTime.DAY, 0],
      [ENDPOINT, 1],
      [ENDPOINT + 1, 0],
    ])
  })

  it('orders state changes in the same block by log index and rolls them back by omission', () => {
    const deposit = noteEvent(
      0,
      ENDPOINT - UnixTime.DAY,
      true,
      ENDPOINT + UnixTime.DAY,
      10n,
    )
    const escapeEvent = {
      ...noteEvent(0, ENDPOINT - UnixTime.DAY, false),
      logIndex: 1,
    }
    const challenge = {
      ...noteEvent(0, ENDPOINT - UnixTime.DAY, true),
      logIndex: 2,
    }
    const calculate = (events: PrivacyAnonymitySetEventRecord[]) =>
      calculateAnonymitySetHistory(
        [],
        [series({ unit: 'note' })],
        [ENDPOINT],
        events,
      )
    expect(calculate([challenge, escapeEvent, deposit])).toEqual([
      [ENDPOINT, 1],
    ])
    expect(calculate([escapeEvent, deposit])).toEqual([[ENDPOINT, 0]])
    expect(calculate([deposit])).toEqual([[ENDPOINT, 1]])
  })
  it('uses inclusive threshold, distinct senders, and exact window boundaries', () => {
    const rows = [
      senderDay('alice', ENDPOINT - 30 * UnixTime.DAY, 10n),
      senderDay('alice', ENDPOINT - 1 * UnixTime.DAY, 100n),
      senderDay('bob', ENDPOINT - 1 * UnixTime.DAY, 9n),
      senderDay('carol', ENDPOINT, 100n),
    ]

    const result = calculateAnonymitySetHistory(
      rows,
      [series({ minimumAmount: '10' })],
      [ENDPOINT],
    )

    expect(result).toEqual([[ENDPOINT, 1]])
  })

  it('does not merge buckets or tokens', () => {
    const rows = [
      senderDay('alice', ENDPOINT - UnixTime.DAY, 10n, 'bucket-a'),
      senderDay('bob', ENDPOINT - UnixTime.DAY, 10n, 'bucket-b'),
    ]

    const result = calculateAnonymitySetHistory(
      rows,
      [series({ bucketId: 'bucket-a' }), series({ bucketId: 'bucket-b' })],
      [ENDPOINT],
    )

    expect(result).toEqual([[ENDPOINT, 1, 1]])
  })

  it('keeps a sender until their last qualifying day leaves the window', () => {
    const rows = [
      senderDay('alice', ENDPOINT - 31 * UnixTime.DAY, 10n),
      senderDay('alice', ENDPOINT - 2 * UnixTime.DAY, 10n),
    ]

    const result = calculateAnonymitySetHistory(
      rows,
      [series()],
      [ENDPOINT - UnixTime.DAY, ENDPOINT],
    )

    expect(result).toEqual([
      [ENDPOINT - UnixTime.DAY, 1],
      [ENDPOINT, 1],
    ])
  })
})

describe(calculateAnonymitySetHoldingDuration.name, () => {
  it('counts a sender from the first duration containing their latest deposit', () => {
    const rows = [
      senderDay('alice', ENDPOINT - 7 * UnixTime.DAY, 10n),
      senderDay('bob', ENDPOINT - 30 * UnixTime.DAY, 10n),
    ]

    const result = calculateAnonymitySetHoldingDuration(
      rows,
      [series()],
      ENDPOINT,
      [7, 30],
    )

    expect(result[0]).toEqual([7, 1])
    expect(result.at(-1)).toEqual([30, 2])
  })
})

function series(
  overrides?: Partial<PrivacyAnonymitySetSeries>,
): PrivacyAnonymitySetSeries {
  return {
    id: 'series',
    configurationId: 'configuration',
    projectId: 'project',
    bucketId: 'bucket',
    chain: 'ethereum',
    bucketType: 'pool',
    label: '≥10 ETH',
    token: 'ETH',
    formattedAmount: '10',
    minimumAmount: '10',
    sinceTimestamp: ENDPOINT - 100 * UnixTime.DAY,
    ...overrides,
  }
}

function senderDay(
  sender: string,
  timestamp: number,
  maximumAmount: bigint,
  bucketId = 'bucket',
): PrivacyAnonymitySetSenderDayRecord {
  return {
    projectId: 'project',
    bucketId,
    sender,
    timestamp: UnixTime(timestamp),
    maximumAmount,
  }
}

function noteEvent(
  id: number,
  timestamp: number,
  active: boolean,
  expiresAt: number | null = null,
  amount = 0n,
): PrivacyAnonymitySetEventRecord {
  return {
    configurationId: 'configuration',
    projectId: 'project',
    bucketId: 'bucket',
    chain: 'ethereum',
    timestamp: UnixTime(timestamp),
    blockNumber: timestamp,
    txHash: '0x1234',
    logIndex: 0,
    sender: null,
    amount,
    note: {
      id,
      active,
      expiresAt: expiresAt === null ? null : UnixTime(expiresAt),
    },
  }
}

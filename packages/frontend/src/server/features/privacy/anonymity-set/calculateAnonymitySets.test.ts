import type { PrivacyAnonymitySetSenderDayRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
} from './calculateAnonymitySets'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

const ENDPOINT = UnixTime.fromDate(new Date('2026-08-21T00:00:00Z'))

describe(calculateAnonymitySetHistory.name, () => {
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
    label: '≥10 ETH',
    token: 'ETH',
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

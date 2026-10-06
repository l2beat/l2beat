import type {
  PrivacyAnonymitySetSenderDayRecord,
  PrivacyNoteRecord,
  PrivacyNoteStatusChangeRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
  type PrivacyAnonymitySetRecords,
} from './calculateAnonymitySets'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

const ENDPOINT = UnixTime.fromDate(new Date('2026-08-21T00:00:00Z'))

describe(calculateAnonymitySetHistory.name, () => {
  it('counts active notes individually and applies deposit, amount and expiry boundaries', () => {
    // Each note sits on one side of a boundary: window start (0 in, 4 out),
    // threshold (1 in, 2 out), expiry (0 in, 3 out), endpoint (5 out), and
    // another configuration (6 out).
    const notes = [
      note(0, ENDPOINT - 30 * UnixTime.DAY, 10n, ENDPOINT),
      note(1, ENDPOINT - UnixTime.DAY, 10n, ENDPOINT + UnixTime.DAY),
      note(2, ENDPOINT - UnixTime.DAY, 9n, ENDPOINT + UnixTime.DAY),
      note(3, ENDPOINT - UnixTime.DAY, 10n, ENDPOINT - 1),
      note(4, ENDPOINT - 30 * UnixTime.DAY - 1, 10n, ENDPOINT + UnixTime.DAY),
      note(5, ENDPOINT, 10n, ENDPOINT + UnixTime.DAY),
      {
        ...note(6, ENDPOINT - UnixTime.DAY, 10n, ENDPOINT + UnixTime.DAY),
        configurationId: 'other',
      },
    ]

    expect(
      calculateAnonymitySetHistory(
        records({ notes }),
        [series({ unit: 'note' })],
        [ENDPOINT],
      ),
    ).toEqual([[ENDPOINT, 2]])
  })

  it('removes an escape immediately, restores a challenged note, and keeps past counts intact', () => {
    // One note is escaped, challenged and closed on consecutive days; each
    // endpoint must see only the changes made before it.
    const notes = [
      note(0, ENDPOINT - 3 * UnixTime.DAY, 10n, ENDPOINT + UnixTime.DAY),
    ]
    const noteStatusChanges = [
      statusChange(0, ENDPOINT - 2 * UnixTime.DAY, false),
      statusChange(0, ENDPOINT - UnixTime.DAY, true),
      statusChange(0, ENDPOINT, false),
    ]

    expect(
      calculateAnonymitySetHistory(
        records({ notes, noteStatusChanges }),
        [series({ unit: 'note' })],
        [
          ENDPOINT - 2 * UnixTime.DAY,
          ENDPOINT - UnixTime.DAY,
          ENDPOINT,
          ENDPOINT + 1,
        ],
      ),
    ).toEqual([
      [ENDPOINT - 2 * UnixTime.DAY, 1],
      [ENDPOINT - UnixTime.DAY, 0],
      [ENDPOINT, 1],
      [ENDPOINT + 1, 0],
    ])
  })

  it('orders status changes in the same block by log index and rolls them back by omission', () => {
    // The changes are passed in reverse order; dropping the later ones
    // emulates a reorg removing them.
    const notes = [
      note(0, ENDPOINT - UnixTime.DAY, 10n, ENDPOINT + UnixTime.DAY),
    ]
    const escapeStart = statusChange(0, ENDPOINT - UnixTime.DAY, false, 1)
    const challenge = statusChange(0, ENDPOINT - UnixTime.DAY, true, 2)
    const calculate = (noteStatusChanges: PrivacyNoteStatusChangeRecord[]) =>
      calculateAnonymitySetHistory(
        records({ notes, noteStatusChanges }),
        [series({ unit: 'note' })],
        [ENDPOINT],
      )

    expect(calculate([challenge, escapeStart])).toEqual([[ENDPOINT, 1]])
    expect(calculate([escapeStart])).toEqual([[ENDPOINT, 0]])
    expect(calculate([])).toEqual([[ENDPOINT, 1]])
  })

  it('ignores status changes of unknown notes', () => {
    const notes = [
      note(0, ENDPOINT - UnixTime.DAY, 10n, ENDPOINT + UnixTime.DAY),
    ]
    const noteStatusChanges = [
      statusChange(1, ENDPOINT - UnixTime.DAY, true),
      {
        ...statusChange(0, ENDPOINT - UnixTime.DAY, false),
        configurationId: 'other',
      },
    ]

    expect(
      calculateAnonymitySetHistory(
        records({ notes, noteStatusChanges }),
        [series({ unit: 'note' })],
        [ENDPOINT],
      ),
    ).toEqual([[ENDPOINT, 1]])
  })

  it('uses inclusive threshold, distinct senders, and exact window boundaries', () => {
    const rows = [
      senderDay('alice', ENDPOINT - 30 * UnixTime.DAY, 10n),
      senderDay('alice', ENDPOINT - 1 * UnixTime.DAY, 100n),
      senderDay('bob', ENDPOINT - 1 * UnixTime.DAY, 9n),
      senderDay('carol', ENDPOINT, 100n),
    ]

    const result = calculateAnonymitySetHistory(
      records({ senderDays: rows }),
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
      records({ senderDays: rows }),
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
      records({ senderDays: rows }),
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
    unit: 'depositor',
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

function records(
  overrides?: Partial<PrivacyAnonymitySetRecords>,
): PrivacyAnonymitySetRecords {
  return { senderDays: [], notes: [], noteStatusChanges: [], ...overrides }
}

function note(
  noteId: number,
  timestamp: number,
  amount: bigint,
  expiresAt: number,
): PrivacyNoteRecord {
  return {
    configurationId: 'configuration',
    projectId: 'project',
    noteId,
    timestamp: UnixTime(timestamp),
    txHash: '0x1234',
    amount,
    expiresAt: UnixTime(expiresAt),
  }
}

function statusChange(
  noteId: number,
  timestamp: number,
  active: boolean,
  logIndex = 0,
): PrivacyNoteStatusChangeRecord {
  return {
    configurationId: 'configuration',
    projectId: 'project',
    noteId,
    timestamp: UnixTime(timestamp),
    blockNumber: timestamp,
    txHash: '0x1234',
    logIndex,
    active,
  }
}

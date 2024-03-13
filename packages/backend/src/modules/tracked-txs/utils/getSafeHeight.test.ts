import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  trackedTxConfigEntryToRecord,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { getSafeHeight } from './getSafeHeight'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2021-01-01'))
const NOW = UnixTime.fromDate(new Date('2023-01-01'))

describe(getSafeHeight.name, () => {
  it('database and toAdd are empty', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = []
    const toAdd: TrackedTxConfigEntry[] = []

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(MIN_TIMESTAMP.toNumber())
  })

  it('database is empty, toAdd has one entries', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = []
    const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')
    const toAdd: TrackedTxConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(sinceTimestamp.toNumber())
  })

  it('database has entries, toAdd is empty', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      getMockRecord(MIN_TIMESTAMP, NOW),
    ]
    const toAdd: TrackedTxConfigEntry[] = []

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(NOW.toNumber())
  })

  it('database & toAdd have entries', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      getMockRecord(MIN_TIMESTAMP, NOW),
    ]
    const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')
    const toAdd: TrackedTxConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(sinceTimestamp.toNumber())
  })

  it('database entries with undefined lastSyncedTimestamp use sinceTimestamp', () => {
    const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')

    const databaseEntries: TrackedTxsConfigRecord[] = [
      getMockRecord(sinceTimestamp, undefined),
    ]
    const toAdd: TrackedTxConfigEntry[] = []

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(sinceTimestamp.toNumber())
  })

  it('earliest timestamp is older than minimum timestamp', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      getMockRecord(MIN_TIMESTAMP, NOW),
    ]
    const sinceTimestamp = MIN_TIMESTAMP.add(-1, 'hours')
    const toAdd: TrackedTxConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

    const result = getSafeHeight(
      databaseEntries,
      configurationsToRecords(toAdd),
      MIN_TIMESTAMP,
    )

    expect(result).toEqual(MIN_TIMESTAMP.toNumber())
  })

  it('synced archived configuration does not affect safe height', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      {
        ...getMockRecord(MIN_TIMESTAMP, NOW),
        untilTimestamp: NOW.add(-7, 'days'),
        lastSyncedTimestamp: NOW.add(-7, 'days'),
      },
      {
        ...getMockRecord(MIN_TIMESTAMP, NOW),
      },
    ]

    const result = getSafeHeight(databaseEntries, [], MIN_TIMESTAMP)

    expect(result).toEqual(NOW.toNumber())
  })
})

function getMockConfiguration(sinceTimestamp: UnixTime): TrackedTxConfigEntry {
  return {
    sinceTimestamp,
    // the rest of params are irrelevant to the tests
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    uses: [
      {
        type: 'liveness',
        subtype: 'batchSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  }
}

const getMockRecord = (
  sinceTimestamp: UnixTime,
  lastSyncedTimestamp: UnixTime | undefined,
): TrackedTxsConfigRecord => {
  const { projectId, uses } = getMockConfiguration(sinceTimestamp)
  return {
    sinceTimestamp,
    lastSyncedTimestamp,
    // the rest of params are irrelevant to the tests
    id: uses[0].id,
    projectId,
    debugInfo: '',
    type: uses[0].type,
    subtype: uses[0].subtype,
  }
}

const configurationsToRecords = (configs: TrackedTxConfigEntry[]) =>
  configs.flatMap((c) => c.uses.map((u) => trackedTxConfigEntryToRecord(c, u)))

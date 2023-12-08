import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessConfigurationRecord } from '../../../peripherals/database/LivenessConfigurationRepository'
import { makeLivenessTransfer } from '../types/LivenessConfig'
import { getSyncStatus } from './getSyncStatus'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date(0))
const NOW = UnixTime.now()

describe(getSyncStatus.name, () => {
  it('new entries to add to the DB', () => {
    const toAdd = [getMockConfiguration()]

    const syncStatus = getSyncStatus([], toAdd, MIN_TIMESTAMP)
    expect(syncStatus).toEqual(MIN_TIMESTAMP)
  })

  it('some configurations in DB have undefined lastSyncedTimestamp', () => {
    const databaseEntries: LivenessConfigurationRecord[] = [
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW,
      },
      {
        ...getMockRecord(),
        lastSyncedTimestamp: undefined,
      },
    ]

    const syncStatus = getSyncStatus(databaseEntries, [], MIN_TIMESTAMP)
    expect(syncStatus).toEqual(MIN_TIMESTAMP)
  })

  it('some configs are out of sync', () => {
    const databaseEntries: LivenessConfigurationRecord[] = [
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW.add(-2, 'hours'),
      },
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW.add(-1, 'hours'),
      },
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW,
      },
    ]

    const syncStatus = getSyncStatus(databaseEntries, [], MIN_TIMESTAMP)
    expect(syncStatus).toEqual(NOW.add(-2, 'hours'))
  })

  it('everything is synced', () => {
    const databaseEntries: LivenessConfigurationRecord[] = [
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW,
      },
      {
        ...getMockRecord(),
        lastSyncedTimestamp: NOW,
      },
    ]

    const syncStatus = getSyncStatus(databaseEntries, [], MIN_TIMESTAMP)
    expect(syncStatus).toEqual(NOW)
  })
})

function getMockConfiguration() {
  return makeLivenessTransfer({
    projectId: ProjectId('project1'),
    type: 'DA',
    formula: 'transfer',
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    sinceTimestamp: new UnixTime(0),
  })
}

const getMockRecord = (): LivenessConfigurationRecord => {
  const { id, projectId, type, sinceTimestamp } = getMockConfiguration()
  return {
    id,
    projectId,
    type,
    sinceTimestamp,
    debugInfo: '',
  }
}

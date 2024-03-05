// import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
// import { expect } from 'earl'
// TODO: (tracked_tx) add this later

// import { LivenessConfigurationRecord } from '../../liveness/repositories/LivenessConfigurationRepository'
// import {
//   LivenessConfigEntry,
//   makeLivenessTransfer,
// } from '../../liveness/types/LivenessConfig'
// import { getSafeHeight } from './getSafeHeight'

// const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2021-01-01'))
// const NOW = UnixTime.fromDate(new Date('2023-01-01'))

// describe(getSafeHeight.name, () => {
//   it('database and toAdd are empty', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = []
//     const toAdd: LivenessConfigEntry[] = []

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(MIN_TIMESTAMP.toNumber())
//   })

//   it('database is empty, toAdd has one entries', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = []
//     const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')
//     const toAdd: LivenessConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(sinceTimestamp.toNumber())
//   })

//   it('database has entries, toAdd is empty', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = [
//       getMockRecord(MIN_TIMESTAMP, NOW),
//     ]
//     const toAdd: LivenessConfigEntry[] = []

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(NOW.toNumber())
//   })

//   it('database & toAdd have entries', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = [
//       getMockRecord(MIN_TIMESTAMP, NOW),
//     ]
//     const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')
//     const toAdd: LivenessConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(sinceTimestamp.toNumber())
//   })

//   it('database entries with undefined lastSyncedTimestamp use sinceTimestamp', () => {
//     const sinceTimestamp = MIN_TIMESTAMP.add(365, 'days')

//     const databaseEntries: LivenessConfigurationRecord[] = [
//       getMockRecord(sinceTimestamp, undefined),
//     ]
//     const toAdd: LivenessConfigEntry[] = []

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(sinceTimestamp.toNumber())
//   })

//   it('earliest timestamp is older than minimum timestamp', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = [
//       getMockRecord(MIN_TIMESTAMP, NOW),
//     ]
//     const sinceTimestamp = MIN_TIMESTAMP.add(-1, 'hours')
//     const toAdd: LivenessConfigEntry[] = [getMockConfiguration(sinceTimestamp)]

//     const result = getSafeHeight(databaseEntries, toAdd, MIN_TIMESTAMP)

//     expect(result).toEqual(MIN_TIMESTAMP.toNumber())
//   })

//   it('synced archived configuration does not affect safe height', () => {
//     const databaseEntries: LivenessConfigurationRecord[] = [
//       {
//         ...getMockRecord(MIN_TIMESTAMP, NOW),
//         untilTimestamp: NOW.add(-7, 'days'),
//         lastSyncedTimestamp: NOW.add(-7, 'days'),
//       },
//       {
//         ...getMockRecord(MIN_TIMESTAMP, NOW),
//       },
//     ]

//     const result = getSafeHeight(databaseEntries, [], MIN_TIMESTAMP)

//     expect(result).toEqual(NOW.toNumber())
//   })
// })

// function getMockConfiguration(sinceTimestamp: UnixTime) {
//   return makeLivenessTransfer({
//     sinceTimestamp,
//     // the rest of params are irrelevant to the tests
//     projectId: ProjectId('project1'),
//     type: 'DA',
//     formula: 'transfer',
//     from: EthereumAddress.random(),
//     to: EthereumAddress.random(),
//   })
// }

// const getMockRecord = (
//   sinceTimestamp: UnixTime,
//   lastSyncedTimestamp: UnixTime | undefined,
// ): LivenessConfigurationRecord => {
//   const { id, projectId, type } = getMockConfiguration(sinceTimestamp)
//   return {
//     sinceTimestamp,
//     lastSyncedTimestamp,
//     // the rest of params are irrelevant to the tests
//     id,
//     projectId,
//     type,
//     debugInfo: '',
//   }
// }

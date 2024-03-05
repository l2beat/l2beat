// import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
// import { expect } from 'earl'
// TODO: (tracked_tx) add this later

// import { LivenessConfigurationRecord } from '../../liveness/repositories/LivenessConfigurationRepository'
// import {
//   LivenessConfigEntry,
//   makeLivenessFunctionCall,
//   makeLivenessTransfer,
// } from '../../liveness/types/LivenessConfig'
// import { findConfigurationsToSync } from './findConfigurationsToSync'

// const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

// const CONFIGURATIONS: LivenessConfigEntry[] = [
//   makeLivenessTransfer({
//     projectId: ProjectId('project1'),
//     formula: 'transfer',
//     from: EthereumAddress.random(),
//     to: EthereumAddress.random(),
//     type: 'DA',
//     sinceTimestamp: FROM,
//   }),
//   makeLivenessFunctionCall({
//     projectId: ProjectId('project1'),
//     formula: 'functionCall',
//     address: EthereumAddress.random(),
//     selector: '0x9aaab648',
//     sinceTimestamp: FROM,
//     type: 'STATE',
//   }),
// ]

// describe(findConfigurationsToSync.name, () => {
//   it('should return configurations that need to be synced', () => {
//     const dbEntries: LivenessConfigurationRecord[] = [
//       {
//         ...CONFIGURATIONS[0],
//         lastSyncedTimestamp: FROM.add(1, 'hours'),
//         debugInfo: '',
//       },
//       {
//         ...CONFIGURATIONS[1],
//         lastSyncedTimestamp: undefined,
//         debugInfo: '',
//       },
//     ]

//     const result = findConfigurationsToSync(
//       CONFIGURATIONS,
//       dbEntries,
//       FROM,
//       FROM.add(1, 'hours'),
//     )

//     expect(result).toEqual([CONFIGURATIONS[1]])
//   })

//   it('returns empty array if there is nothing to sync', () => {
//     const dbEntries: LivenessConfigurationRecord[] = CONFIGURATIONS.map(
//       (c) => ({
//         ...c,
//         lastSyncedTimestamp: FROM.add(1, 'hours'),
//         debugInfo: '',
//       }),
//     )

//     const result = findConfigurationsToSync(
//       CONFIGURATIONS,
//       dbEntries,
//       FROM,
//       FROM.add(1, 'hours'),
//     )

//     expect(result).toEqual([])
//   })

//   it('should return empty array if no configurations', () => {
//     const result = findConfigurationsToSync([], [], FROM, FROM.add(1, 'hours'))
//     expect(result).toEqual([])
//   })
// })

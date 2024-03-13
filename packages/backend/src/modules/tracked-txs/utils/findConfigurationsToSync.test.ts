import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { findConfigurationsToSync } from './findConfigurationsToSync'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

const CONFIGURATIONS: TrackedTxConfigEntry[] = [
  {
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    sinceTimestamp: FROM,
    uses: [
      {
        type: 'liveness',
        subtype: 'batchSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
  {
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x9aaab648',
    sinceTimestamp: FROM,
    uses: [
      { type: 'liveness', subtype: 'stateUpdates', id: TrackedTxId.random() },
      {
        type: 'liveness',
        subtype: 'proofSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
]

describe(findConfigurationsToSync.name, () => {
  it('should return configurations that need to be synced', () => {
    const dbEntries: TrackedTxsConfigRecord[] = [
      {
        ...CONFIGURATIONS[0],
        ...CONFIGURATIONS[0].uses[0],
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        debugInfo: '',
      },
      {
        ...CONFIGURATIONS[1],
        ...CONFIGURATIONS[1].uses[0],
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        debugInfo: '',
      },
      {
        ...CONFIGURATIONS[1],
        ...CONFIGURATIONS[1].uses[1],
        lastSyncedTimestamp: undefined,
        debugInfo: '',
      },
    ]

    const result = findConfigurationsToSync(
      CONFIGURATIONS,
      dbEntries,
      FROM,
      FROM.add(1, 'hours'),
    )

    expect(result).toEqual([
      {
        ...CONFIGURATIONS[1],
        uses: [CONFIGURATIONS[1].uses[1]],
      },
    ])
  })

  it('returns empty array if there is nothing to sync', () => {
    const dbEntries: TrackedTxsConfigRecord[] = CONFIGURATIONS.flatMap((c) =>
      c.uses.map((u) => ({
        ...c,
        ...u,
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        debugInfo: '',
      })),
    )

    const result = findConfigurationsToSync(
      CONFIGURATIONS,
      dbEntries,
      FROM,
      FROM.add(1, 'hours'),
    )

    expect(result).toEqual([])
  })

  it('should return empty array if no configurations', () => {
    const result = findConfigurationsToSync([], [], FROM, FROM.add(1, 'hours'))
    expect(result).toEqual([])
  })
})

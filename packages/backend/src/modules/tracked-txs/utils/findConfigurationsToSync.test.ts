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
    sinceTimestampInclusive: FROM,
    uses: [
      {
        type: 'liveness',
        subtype: 'batchSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
  {
    projectId: ProjectId('project2'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x9aaab648',
    sinceTimestampInclusive: FROM,
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
      ['liveness'],
      CONFIGURATIONS,
      dbEntries,
      FROM,
      FROM.add(1, 'hours'),
    )

    expect(result).toEqual({
      configurationsToSync: [
        {
          ...CONFIGURATIONS[1],
          uses: [CONFIGURATIONS[1].uses[1]],
        },
      ],
      syncTo: FROM.add(1, 'hours'),
    })
  })

  it('should return syncTo equal to the closest untilTimestamp', () => {
    const configurations: TrackedTxConfigEntry[] = [
      ...CONFIGURATIONS,
      {
        projectId: ProjectId('project3'),
        formula: 'functionCall',
        address: EthereumAddress.random(),
        selector: '0x9aaab64a',
        sinceTimestampInclusive: FROM,
        untilTimestampExclusive: FROM.add(16, 'hours'),
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
            id: TrackedTxId.random(),
          },
        ],
      },
    ]

    const dbEntries: TrackedTxsConfigRecord[] = [
      {
        ...configurations[0],
        ...configurations[0].uses[0],
        lastSyncedTimestamp: FROM,
        debugInfo: '',
      },
      {
        ...configurations[1],
        ...configurations[1].uses[0],
        lastSyncedTimestamp: FROM,
        debugInfo: '',
      },
      {
        ...configurations[1],
        ...configurations[1].uses[1],
        lastSyncedTimestamp: FROM,
        debugInfo: '',
      },
      {
        ...configurations[2],
        ...configurations[2].uses[0],
        lastSyncedTimestamp: FROM,
        debugInfo: '',
      },
    ]

    const result = findConfigurationsToSync(
      ['liveness'],
      configurations,
      dbEntries,
      FROM,
      FROM.add(24, 'hours'),
    )

    expect(result).toEqual({
      configurationsToSync: configurations,
      syncTo: FROM.add(16, 'hours'),
    })
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
      ['liveness'],
      CONFIGURATIONS,
      dbEntries,
      FROM,
      FROM.add(1, 'hours'),
    )

    expect(result).toEqual({
      configurationsToSync: [],
      syncTo: FROM.add(1, 'hours'),
    })
  })

  it('should skip configurations which updater is not available', () => {
    const configurations: TrackedTxConfigEntry[] = [
      {
        ...CONFIGURATIONS[0],
        uses: [
          //@ts-expect-error fees is not yet defined as type but needed for tests
          ...CONFIGURATIONS[0].uses,
          {
            //@ts-expect-error fees is not yet defined as type but needed for tests
            type: 'fees',
            subtype: 'batchSubmissions',
            id: TrackedTxId.random(),
          },
        ],
      },
      ...CONFIGURATIONS.slice(1),
    ]

    const dbEntries: TrackedTxsConfigRecord[] = [
      {
        ...configurations[0],
        ...configurations[0].uses[0],
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        debugInfo: '',
      },
      {
        ...configurations[0],
        ...configurations[0].uses[1],
        lastSyncedTimestamp: undefined,
        debugInfo: '',
      },
      {
        ...configurations[1],
        ...configurations[1].uses[0],
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        debugInfo: '',
      },
      {
        ...configurations[1],
        ...configurations[1].uses[1],
        lastSyncedTimestamp: undefined,
        debugInfo: '',
      },
    ]

    const result = findConfigurationsToSync(
      ['liveness'],
      configurations,
      dbEntries,
      FROM,
      FROM.add(1, 'hours'),
    )

    expect(result).toEqual({
      configurationsToSync: [
        {
          ...CONFIGURATIONS[1],
          uses: [CONFIGURATIONS[1].uses[1]],
        },
      ],
      syncTo: FROM.add(1, 'hours'),
    })
  })

  it('should return empty array if no configurations', () => {
    const result = findConfigurationsToSync(
      ['liveness'],
      [],
      [],
      FROM,
      FROM.add(1, 'hours'),
    )
    expect(result).toEqual({
      configurationsToSync: [],
      syncTo: FROM.add(1, 'hours'),
    })
  })
})

import type { ProjectPrivacyInfo } from '@l2beat/config'
import type { IndexerConfigurationRecord } from '@l2beat/database'
import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
} from './getPrivacyAnonymitySetSeries'
import { getPrivacyAnonymitySetSyncStatus } from './getPrivacyAnonymitySetSync'

describe(getPrivacyAnonymitySetSyncStatus.name, () => {
  const target = UnixTime(2_000)

  it('partitions series by whether their configuration reached the target', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)
    const [firstId, secondId] = series.map((series) => series.configurationId)

    const result = getPrivacyAnonymitySetSyncStatus(
      series,
      [configuration(firstId!, target), configuration(secondId!, target - 1)],
      target,
    )

    expect(result.syncedSeries.map((item) => item.bucketId)).toEqual(['first'])
    expect(result.syncingSeries.map((item) => item.bucketId)).toEqual([
      'second',
    ])
    expect(result.syncingLabels).toEqual([series[1]!.label])
  })

  it('uses compact amounts in syncing labels without changing the series labels', () => {
    const minimumAmounts = [
      '999',
      '1000',
      '1500',
      '20000',
      '1500000',
      '1000000000',
      '1000000000000',
    ]
    const series = getPrivacyAnonymitySetSeries(
      makeProject(minimumAmounts, 0),
    ).filter((item) => item.bucketId === 'first')

    const result = getPrivacyAnonymitySetSyncStatus(series, [], target)

    expect(result.syncingLabels).toEqual([
      '≥999 ETH',
      '≥1 K ETH',
      '≥1.5 K ETH',
      '≥20 K ETH',
      '≥1.5 M ETH',
      '≥1 B ETH',
      '≥1 T ETH',
    ])
    expect(series.map((item) => item.label)).toEqual(
      minimumAmounts.map((amount) => `≥${amount} ETH`),
    )

    const denominationSeries = getPrivacyAnonymitySetSeries(
      makeProject(['20000'], 0, 'denomination'),
    ).filter((item) => item.bucketId === 'first')
    const denominationResult = getPrivacyAnonymitySetSyncStatus(
      denominationSeries,
      [],
      target,
    )

    expect(denominationResult.syncingLabels).toEqual(['20 K ETH'])
  })

  it('requires an active, started configuration', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)
    const [firstId, secondId] = series.map((series) => series.configurationId)

    const result = getPrivacyAnonymitySetSyncStatus(
      series,
      [configuration(firstId!, null), configuration(secondId!, target, target)],
      target,
    )

    expect(result.syncedSeries).toEqual([])
    expect(result.syncingSeries).toEqual(series)
  })

  it('does not substitute an old configuration for the expected id', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)

    const result = getPrivacyAnonymitySetSyncStatus(
      series,
      [configuration('old-configuration', target)],
      target,
    )

    expect(result.syncedSeries).toEqual([])
    expect(result.syncingSeries).toEqual(series)
  })

  it('keeps thresholds on one ingestion configuration and reveals them together', () => {
    const initial = getPrivacyAnonymitySetSeries(makeProject(['1']))
    const changed = getPrivacyAnonymitySetSeries(makeProject(['1', '10']))
    const firstConfigurationId = changed[0]!.configurationId

    expect(
      changed
        .filter((series) => series.minimumAmount === '1')
        .map((series) => series.configurationId),
    ).toEqual(initial.map((series) => series.configurationId))
    expect(
      new Set(changed.map((series) => series.configurationId)).size,
    ).toEqual(2)

    const result = getPrivacyAnonymitySetSyncStatus(
      changed,
      [configuration(firstConfigurationId, target)],
      target,
    )
    expect(result.syncedSeries.map((item) => item.minimumAmount)).toEqual([
      '1',
      '10',
    ])
    expect(result.syncingSeries.map((item) => item.minimumAmount)).toEqual([
      '1',
      '10',
    ])
  })
})

function makeProject(
  minimumAmounts: string[] = ['1'],
  decimals = 18,
  bucketType: 'pool' | 'denomination' = 'pool',
): PrivacyAnonymitySetProject {
  const addresses = [
    EthereumAddress(`0x${'11'.repeat(20)}`),
    EthereumAddress(`0x${'22'.repeat(20)}`),
  ]
  const privacyInfo = mockObject<ProjectPrivacyInfo>({
    tokens: [
      {
        token: {
          address: EthereumAddress.ZERO,
          iconUrl: undefined,
          symbol: 'ETH',
          decimals,
          priceId: 'ethereum',
          sinceTimestamp: UnixTime(0),
        },
        buckets: ['first', 'second'].map((id, index) => ({
          id,
          type: bucketType,
          label: id,
          address: ChainSpecificAddress.fromLong('ethereum', addresses[index]!),
          sinceTimestamp: UnixTime(0),
          anonymitySet: { minimumAmounts },
          deposit: {
            event: `0x${'11'.repeat(32)}`,
            extractor: 'fixedAmount' as const,
            params: { amount: '1' },
          },
          withdrawal: {
            event: `0x${'22'.repeat(32)}`,
            extractor: 'fixedAmount' as const,
            params: { amount: '1' },
          },
        })),
      },
    ],
  })

  return { id: ProjectId('project'), privacyInfo }
}

function configuration(
  id: string,
  currentHeight: UnixTime | null,
  maxHeight: number | null = null,
): IndexerConfigurationRecord {
  return mockObject<IndexerConfigurationRecord>({
    id,
    indexerId: 'privacy_anonymity_set_indexer::ethereum',
    properties: '{}',
    currentHeight,
    minHeight: 0,
    maxHeight,
  })
}

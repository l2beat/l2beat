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
    expect(result.syncingTokens).toEqual(['ETH'])
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
          decimals: 18,
          priceId: 'ethereum',
          sinceTimestamp: UnixTime(0),
        },
        buckets: ['first', 'second'].map((id, index) => ({
          id,
          type: 'pool' as const,
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

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
import { getPrivacyAnonymitySetSyncedUntil } from './getPrivacyAnonymitySetSync'

describe(getPrivacyAnonymitySetSyncedUntil.name, () => {
  it('returns the earliest height of all expected configurations', () => {
    const project = makeProject()
    const [firstId, secondId] = getPrivacyAnonymitySetSeries(project).map(
      (series) => series.configurationId,
    )
    const earlier = UnixTime(1_000)

    const result = getPrivacyAnonymitySetSyncedUntil(project, [
      configuration(firstId!, earlier),
      configuration(secondId!, UnixTime(2_000)),
    ])

    expect(result).toEqual(earlier)
  })

  it('returns undefined when any expected configuration has not started', () => {
    const project = makeProject()
    const [firstId, secondId] = getPrivacyAnonymitySetSeries(project).map(
      (series) => series.configurationId,
    )

    const result = getPrivacyAnonymitySetSyncedUntil(project, [
      configuration(firstId!, UnixTime(1_000)),
      configuration(secondId!, null),
    ])

    expect(result).toEqual(undefined)
  })

  it('does not substitute an old configuration for the expected id', () => {
    const project = makeProject()

    const result = getPrivacyAnonymitySetSyncedUntil(project, [
      configuration('old-configuration', UnixTime(2_000)),
    ])

    expect(result).toEqual(undefined)
  })

  it('does not treat an ended configuration as synced', () => {
    const project = makeProject()
    const [firstId, secondId] = getPrivacyAnonymitySetSeries(project).map(
      (series) => series.configurationId,
    )

    const result = getPrivacyAnonymitySetSyncedUntil(project, [
      configuration(firstId!, UnixTime(1_000), 2_000),
      configuration(secondId!, UnixTime(1_000)),
    ])

    expect(result).toEqual(undefined)
  })

  it('keeps ingestion configuration ids stable when thresholds change', () => {
    const initial = getPrivacyAnonymitySetSeries(makeProject(['1']))
    const changed = getPrivacyAnonymitySetSeries(makeProject(['1', '10']))

    expect(
      changed
        .filter((series) => series.minimumAmount === '1')
        .map((series) => series.configurationId),
    ).toEqual(initial.map((series) => series.configurationId))
    expect(
      new Set(changed.map((series) => series.configurationId)).size,
    ).toEqual(2)
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

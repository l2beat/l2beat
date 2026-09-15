import type { ProjectPrivacyInfo, ProjectPrivacyToken } from '@l2beat/config'
import type {
  IndexerConfigurationRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
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
import { getPrivacyAnonymitySetSummary } from './getPrivacyAnonymitySetSummaries'

const CURRENT_DAY = UnixTime.fromDate(new Date('2026-09-01T00:00:00Z'))
const YESTERDAY = UnixTime(CURRENT_DAY - UnixTime.DAY)

describe(getPrivacyAnonymitySetSummary.name, () => {
  it('reports not-applicable projects with their description', () => {
    const project = makeProject({
      anonymitySet: { type: 'not-applicable', description: 'No pools.' },
    })

    const result = getPrivacyAnonymitySetSummary(
      project,
      getPrivacyAnonymitySetSeries(project),
      [],
      [],
      CURRENT_DAY,
    )

    expect(result).toEqual({
      status: 'not-applicable',
      description: 'No pools.',
    })
  })

  it('reports projects without configured series as unavailable', () => {
    const project = makeProject({ tokens: [] })

    const result = getPrivacyAnonymitySetSummary(
      project,
      [],
      [],
      [],
      CURRENT_DAY,
    )

    expect(result).toEqual({ status: 'unavailable' })
  })

  it('reports syncing until at least one configuration reaches the current day', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)
    const configurations = series.map((item) =>
      configuration(item.configurationId, YESTERDAY),
    )

    const result = getPrivacyAnonymitySetSummary(
      project,
      series,
      configurations,
      [senderDay('eth', 'a', 10n)],
      CURRENT_DAY,
    )

    expect(result).toEqual({ status: 'syncing' })
  })

  it('picks the synced series with the most depositors and lists syncing series', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)
    const ethConfigurationId = series[0]!.configurationId
    const rows = [
      senderDay('eth', 'a', 1n),
      senderDay('eth', 'b', 10n),
      senderDay('eth', 'c', 10n),
      senderDay('dai', 'd', 200n),
      senderDay('dai', 'e', 200n),
      senderDay('dai', 'f', 200n),
      senderDay('dai', 'g', 200n),
    ]

    const result = getPrivacyAnonymitySetSummary(
      project,
      series,
      [configuration(ethConfigurationId, CURRENT_DAY)],
      rows,
      CURRENT_DAY,
    )

    expect(result).toEqual({
      status: 'available',
      value: 3,
      label: '≥1 ETH',
      syncingLabels: ['≥200 DAI'],
      bucketType: 'pool',
      chain: 'ethereum',
      formattedAmount: '1',
      token: 'ETH',
    })
  })

  it('keeps the earlier series when depositor counts tie', () => {
    const project = makeProject()
    const series = getPrivacyAnonymitySetSeries(project)
    const configurations = series.map((item) =>
      configuration(item.configurationId, CURRENT_DAY),
    )

    const result = getPrivacyAnonymitySetSummary(
      project,
      series,
      configurations,
      [senderDay('eth', 'a', 10n), senderDay('eth', 'b', 10n)],
      CURRENT_DAY,
    )

    expect(result).toEqual({
      status: 'available',
      value: 2,
      label: '≥1 ETH',
      syncingLabels: [],
      bucketType: 'pool',
      chain: 'ethereum',
      formattedAmount: '1',
      token: 'ETH',
    })
  })
})

function makeProject({
  anonymitySet,
  tokens = [
    makeToken('eth', 'ETH', `0x${'11'.repeat(20)}`, ['1', '10']),
    makeToken('dai', 'DAI', `0x${'22'.repeat(20)}`, ['200']),
  ],
}: {
  anonymitySet?: ProjectPrivacyInfo['anonymitySet']
  tokens?: ProjectPrivacyToken[]
} = {}): PrivacyAnonymitySetProject {
  return {
    id: ProjectId('project'),
    privacyInfo: mockObject<ProjectPrivacyInfo>({ tokens, anonymitySet }),
  }
}

function makeToken(
  bucketId: string,
  symbol: string,
  address: string,
  minimumAmounts: string[],
): ProjectPrivacyToken {
  return {
    token: {
      address: EthereumAddress.ZERO,
      iconUrl: undefined,
      symbol,
      decimals: 0,
      priceId: symbol.toLowerCase(),
      sinceTimestamp: UnixTime(0),
    },
    buckets: [
      {
        id: bucketId,
        type: 'pool',
        label: bucketId,
        address: ChainSpecificAddress.fromLong(
          'ethereum',
          EthereumAddress(address),
        ),
        sinceTimestamp: UnixTime(0),
        anonymitySet: { minimumAmounts },
        deposit: {
          event: `0x${'11'.repeat(32)}`,
          extractor: 'fixedAmount',
          params: { amount: '1' },
        },
        withdrawal: {
          event: `0x${'22'.repeat(32)}`,
          extractor: 'fixedAmount',
          params: { amount: '1' },
        },
      },
    ],
  }
}

function senderDay(
  bucketId: string,
  sender: string,
  maximumAmount: bigint,
): PrivacyAnonymitySetSenderDayRecord {
  return {
    projectId: 'project',
    bucketId,
    timestamp: YESTERDAY,
    sender,
    maximumAmount,
  }
}

function configuration(
  id: string,
  currentHeight: UnixTime | null,
): IndexerConfigurationRecord {
  return mockObject<IndexerConfigurationRecord>({
    id,
    indexerId: 'privacy_anonymity_set_indexer::ethereum',
    properties: '{}',
    currentHeight,
    minHeight: 0,
    maxHeight: null,
  })
}

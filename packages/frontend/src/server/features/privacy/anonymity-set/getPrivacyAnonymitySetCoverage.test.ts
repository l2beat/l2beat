import type { ProjectPrivacyInfo, ProjectPrivacyToken } from '@l2beat/config'
import type { Database, PrivacyFlowDailyRecord } from '@l2beat/database'
import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getPrivacyAnonymitySetCoverage } from './getPrivacyAnonymitySetCoverage'
import type { PrivacyAnonymitySetProject } from './getPrivacyAnonymitySetSeries'

const CURRENT_DAY = UnixTime.fromDate(new Date('2026-09-01T00:00:00Z'))
const WINDOW_START = UnixTime(CURRENT_DAY - 30 * UnixTime.DAY)

// The database is mocked: the function only combines two counts, so the tests
// pin which rows it asks for and how it relates them.
describe(getPrivacyAnonymitySetCoverage.name, () => {
  it('compares attributed deposits with all deposits into tracked buckets', async () => {
    const { db, getDepositCount, getDailyByProjectIds } = mockDatabase({
      attributed: 8,
      flows: [
        flowDay('tracked', 6),
        flowDay('tracked', 4),
        flowDay('untracked', 100),
      ],
    })

    const coverage = await getPrivacyAnonymitySetCoverage(
      db,
      makeProject({ type: 'partially-attributed' }),
      CURRENT_DAY,
    )

    expect(coverage).toEqual({ attributed: 8, total: 10 })
    expect(getDepositCount).toHaveBeenOnlyCalledWith(
      'project',
      WINDOW_START,
      CURRENT_DAY,
    )
    expect(getDailyByProjectIds).toHaveBeenOnlyCalledWith(
      ['project'],
      WINDOW_START,
      CURRENT_DAY,
    )
  })

  it('skips projects whose depositors are all attributed', async () => {
    const { db, getDepositCount } = mockDatabase({ attributed: 8, flows: [] })

    const coverage = await getPrivacyAnonymitySetCoverage(
      db,
      makeProject(undefined),
      CURRENT_DAY,
    )

    expect(coverage).toEqual(undefined)
    expect(getDepositCount).not.toHaveBeenCalled()
  })

  it('withholds coverage while deposit totals lag behind attributed deposits', async () => {
    const { db } = mockDatabase({
      attributed: 8,
      flows: [flowDay('tracked', 5)],
    })

    const coverage = await getPrivacyAnonymitySetCoverage(
      db,
      makeProject({ type: 'partially-attributed' }),
      CURRENT_DAY,
    )

    expect(coverage).toEqual(undefined)
  })
})

function mockDatabase({
  attributed,
  flows,
}: {
  attributed: number
  flows: PrivacyFlowDailyRecord[]
}) {
  const getDepositCount =
    mockFn<
      Database['privacyAnonymitySetEvent']['getDepositCount']
    >().resolvesTo(attributed)
  const getDailyByProjectIds =
    mockFn<Database['privacyFlowEvent']['getDailyByProjectIds']>().resolvesTo(
      flows,
    )
  const db = mockObject<Database>({
    privacyAnonymitySetEvent: mockObject<Database['privacyAnonymitySetEvent']>({
      getDepositCount,
    }),
    privacyFlowEvent: mockObject<Database['privacyFlowEvent']>({
      getDailyByProjectIds,
    }),
  })
  return { db, getDepositCount, getDailyByProjectIds }
}

function flowDay(bucketId: string, depositCount: number) {
  return mockObject<PrivacyFlowDailyRecord>({ bucketId, depositCount })
}

function makeProject(
  anonymitySet: ProjectPrivacyInfo['anonymitySet'],
): PrivacyAnonymitySetProject {
  const token: ProjectPrivacyToken = {
    token: {
      address: EthereumAddress.ZERO,
      iconUrl: undefined,
      symbol: 'DAI',
      decimals: 0,
      priceId: 'dai',
      sinceTimestamp: UnixTime(0),
    },
    buckets: [
      { ...makeBucket('tracked'), anonymitySet: { minimumAmounts: ['200'] } },
      makeBucket('untracked'),
    ],
  }
  return {
    id: ProjectId('project'),
    privacyInfo: mockObject<ProjectPrivacyInfo>({
      tokens: [token],
      anonymitySet,
    }),
  }
}

function makeBucket(id: string) {
  return {
    id,
    type: 'pool' as const,
    label: id,
    address: ChainSpecificAddress.fromLong(
      'ethereum',
      EthereumAddress(`0x${'11'.repeat(20)}`),
    ),
    sinceTimestamp: UnixTime(0),
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
  }
}

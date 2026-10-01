import { ProjectService } from '@l2beat/config'
import type { Database, IndexerConfigurationRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { describePrivacyMetricCoverage } from '~/utils/privacyMetricCoverage'
import { getPrivacyMetricCoverage } from './getPrivacyMetricCoverage'

const FROM = UnixTime.fromDate(new Date('2026-09-01T00:00:00Z'))
const TO = FROM + 30 * UnixTime.DAY

describe(getPrivacyMetricCoverage.name, () => {
  for (const metric of ['fundingAddresses', 'paidFinalizers'] as const) {
    it(`scopes ${metric} counts to current configurations and the same window`, async () => {
      const project = await new ProjectService().getProject({
        slug: 'zkmoney',
        select: ['privacyInfo'],
      })
      if (!project) throw new Error('Missing zk.money configuration')
      const { db, count, configurations } = database()
      const result = await getPrivacyMetricCoverage(
        db,
        project,
        metric,
        FROM,
        TO,
      )
      expect(result).toEqual({
        coverage: { attributed: 8, total: 10 },
        addresses: metric === 'paidFinalizers' ? 3 : undefined,
      })
      expect(count).toHaveBeenOnlyCalledWith(expect.anything(), FROM, TO)
      const ids = configurations.calls[0]?.args[0]
      expect(ids ?? []).toHaveLength(metric === 'fundingAddresses' ? 2 : 4)
    })

    for (const state of [
      'missing',
      'behind',
      'lateStart',
      'retired',
    ] as const) {
      it(`withholds ${metric} coverage when a required configuration is ${state}`, async () => {
        const project = await new ProjectService().getProject({
          slug: 'zkmoney',
          select: ['privacyInfo'],
        })
        if (!project) throw new Error('Missing zk.money configuration')
        const { db, count } = database(state)
        expect(
          await getPrivacyMetricCoverage(db, project, metric, FROM, TO),
        ).toEqual(undefined)
        expect(count).not.toHaveBeenCalled()
      })
    }
  }

  it('does not show a percentage for an empty observation window', () => {
    expect(
      describePrivacyMetricCoverage({ attributed: 0, total: 0 }, 'operations'),
    ).toEqual('Attributed 0 of 0 operations.')
    expect(
      describePrivacyMetricCoverage({ attributed: 8, total: 10 }, 'deposits'),
    ).toEqual('Attributed 8 of 10 deposits (80%).')
  })
})

function database(state?: 'missing' | 'behind' | 'lateStart' | 'retired') {
  const getByConfigurationIds = mockFn<
    Database['indexerConfiguration']['getByConfigurationIds']
  >().executes((ids) =>
    Promise.resolve(
      ids.flatMap((id, index) => {
        if (index === 0 && state === 'missing') return []
        return [
          mockObject<IndexerConfigurationRecord>({
            id,
            minHeight: index === 0 && state === 'lateStart' ? TO - 1 : FROM,
            maxHeight: index === 0 && state === 'retired' ? TO : null,
            currentHeight: index === 0 && state === 'behind' ? TO - 1 : TO,
          }),
        ]
      }),
    ),
  )
  const count =
    mockFn<Database['privacyFlowEvent']['getOperationCount']>().resolvesTo(10)
  const db = mockObject<Database>({
    indexerConfiguration: mockObject<Database['indexerConfiguration']>({
      getByConfigurationIds,
    }),
    privacyFlowEvent: mockObject<Database['privacyFlowEvent']>({
      getOperationCount: count,
    }),
    privacyAnonymitySetEvent: mockObject<Database['privacyAnonymitySetEvent']>({
      getOperationCount: mockFn().resolvesTo(8),
    }),
    privacyRelayerActivity: mockObject<Database['privacyRelayerActivity']>({
      getAttributedStats: mockFn().resolvesTo({ operations: 8, addresses: 3 }),
    }),
  })
  return { db, count, configurations: getByConfigurationIds }
}

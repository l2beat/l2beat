import { tokenList } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { DetailedTvlController } from './DetailedTvlController'

const START = UnixTime.fromDate(new Date('2022-05-31'))
const MINIMUM_TIMESTAMP = START.add(-1, 'hours')
const USDC = tokenList.find((x) => x.symbol === 'USDC')!

const ARBITRUM: ReportProject = {
  projectId: ProjectId('arbitrum'),
  type: 'layer2',
  escrows: [
    {
      address: EthereumAddress.random(),
      sinceTimestamp: new UnixTime(0),
      tokens: [USDC],
    },
  ],
}

describe(DetailedTvlController.name, () => {
  describe(
    DetailedTvlController.prototype.getDetailedTvlApiResponse.name,
    () => {
      it('selects minimum viable timestamp for the aggregation', async () => {
        const baseReport = {
          timestamp: MINIMUM_TIMESTAMP,
          usdValue: 1234_56n,
          ethValue: 1_111111n,
          amount: 111_1111n * 10n ** (6n - 4n),
          asset: AssetId.USDC,
          chainId: ChainId.ETHEREUM,
          projectId: ARBITRUM.projectId,
          type: ValueType.CBV,
        }

        const baseAggregatedReport = [
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            valueType: ValueType.CBV,
            projectId: ARBITRUM.projectId,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            valueType: ValueType.CBV,
            projectId: ProjectId.ALL,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            valueType: ValueType.CBV,
            projectId: ProjectId.BRIDGES,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            valueType: ValueType.CBV,
            projectId: ProjectId.LAYER2S,
          },
        ]

        const reportStatusRepository = mockObject<ReportStatusRepository>({
          findLatestTimestampOfType: async (type) =>
            type === ValueType.CBV
              ? START
              : type === ValueType.EBV
              ? START.add(-15, 'minutes')
              : type === ValueType.NMV
              ? START.add(-30, 'minutes')
              : undefined,
        })
        const aggregatedReportStatusRepository =
          mockObject<AggregatedReportStatusRepository>({
            findLatestTimestamp: async () => MINIMUM_TIMESTAMP,
          })

        const reportRepository = mockObject<ReportRepository>({
          getByTimestamp: async () => [baseReport],
        })

        const aggregatedReportRepository =
          mockObject<AggregatedReportRepository>({
            getDailyWithAnyType: async () => baseAggregatedReport,
            getHourlyWithAnyType: async () => baseAggregatedReport,
            getSixHourlyWithAnyType: async () => baseAggregatedReport,
          })
        const controller = new DetailedTvlController(
          reportStatusRepository,
          aggregatedReportRepository,
          reportRepository,
          aggregatedReportStatusRepository,
          [ARBITRUM],
          Logger.SILENT,
        )

        await controller.getDetailedTvlApiResponse()

        expect(reportRepository.getByTimestamp).toHaveBeenCalledWith(
          MINIMUM_TIMESTAMP,
        )

        expect(
          aggregatedReportRepository.getDailyWithAnyType,
        ).toHaveBeenCalledTimes(1)

        expect(
          aggregatedReportRepository.getHourlyWithAnyType,
        ).toHaveBeenCalledWith(MINIMUM_TIMESTAMP.add(-7, 'days'))

        expect(
          aggregatedReportRepository.getSixHourlyWithAnyType,
        ).toHaveBeenCalledWith(MINIMUM_TIMESTAMP.add(-90, 'days'))
      })
    },
  )
})

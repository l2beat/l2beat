import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { CirculatingSupplyRepository } from '../../peripherals/database/CirculatingSupplyRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { TotalSupplyRepository } from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { DataUpdater, ReportUpdater } from '../assets'

export interface TvlDatabase {
  readonly blockNumberRepository: BlockNumberRepository
  readonly priceRepository: PriceRepository
  readonly balanceRepository: BalanceRepository
  readonly totalSupplyRepository: TotalSupplyRepository
  readonly circulatingSupplyRepository: CirculatingSupplyRepository
  readonly reportRepository: ReportRepository
  readonly aggregatedReportRepository: AggregatedReportRepository
  // status tables
  readonly balanceStatusRepository: BalanceStatusRepository
  readonly totalSupplyStatusRepository: TotalSupplyStatusRepository
  readonly reportStatusRepository: ReportStatusRepository
  readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository
}
export interface TvlModule {
  chain: string
  reportUpdaters?: ReportUpdater[]
  dataUpdaters?: DataUpdater[]
  start?: () => Promise<void> | void
}

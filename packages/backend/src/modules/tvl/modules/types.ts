import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { DataUpdater, ReportUpdater } from '../assets'
import { AggregatedReportRepository } from '../repositories/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../repositories/AggregatedReportStatusRepository'
import { BalanceRepository } from '../repositories/BalanceRepository'
import { BalanceStatusRepository } from '../repositories/BalanceStatusRepository'
import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { CirculatingSupplyRepository } from '../repositories/CirculatingSupplyRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ReportRepository } from '../repositories/ReportRepository'
import { ReportStatusRepository } from '../repositories/ReportStatusRepository'
import { TotalSupplyRepository } from '../repositories/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../repositories/TotalSupplyStatusRepository'

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
  // cleaner
  readonly tvlCleanerRepository: TvlCleanerRepository
}
export interface TvlModule {
  chain: string
  reportUpdaters?: ReportUpdater[]
  dataUpdaters?: DataUpdater[]
  start?: () => Promise<void> | void
}

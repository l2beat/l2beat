import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'

export interface TvlDatabase {
  readonly blockNumberRepository: BlockNumberRepository
  readonly priceRepository: PriceRepository
  readonly balanceRepository: BalanceRepository
  readonly reportRepository: ReportRepository
  readonly aggregatedReportRepository: AggregatedReportRepository
  readonly reportStatusRepository: ReportStatusRepository
  readonly balanceStatusRepository: BalanceStatusRepository
}

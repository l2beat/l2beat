import { UnixTime } from '@l2beat/common'
import { getAssetId } from '@l2beat/config';

import { BalanceRecord,BalanceRepository } from '../peripherals/database/BalanceRepository'
import { PriceRecord, PriceRepository } from '../peripherals/database/PriceRepository'
import { ReportRecord, ReportRepository } from '../peripherals/database/ReportRepository';

export class ReportUpdater {
  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository
  ) {}

  private lastProcessed = new UnixTime(0)

  async update(dataPoints: { timestamp: UnixTime; blockNumber: bigint }[]) {
    dataPoints = dataPoints.filter((x) => x.timestamp.gt(this.lastProcessed))
    for (const { timestamp, blockNumber } of dataPoints) {
      const [prices, balances] = await Promise.all([
        this.priceRepository.getByTimestamp(timestamp),
        this.balanceRepository.getByBlock(blockNumber),
      ])
      const tvlEntries = this.calculateTVL(prices, balances)
      this.reportRepository.addOrUpdate(tvlEntries)
      this.lastProcessed = timestamp
    }
  }
    calculateTVL(prices: PriceRecord[], balances: BalanceRecord[]): ReportRecord[] {
      const tvls: ReportRecord[] = []
      
      //should we add AssetId to prices table?
      const priceMap = new Map(prices.map(p => ([getAssetId(p.coingeckoId).id, p])))
      
      for(const balance of balances) {
        const price = priceMap.get(balance.assetId)
        
        if(price) {
          tvls.push({
            blockNumber: balance.blockNumber,
            timestamp: price.timestamp,
            bridge: balance.holderAddress,
            asset: balance.assetId,
            //TODO calculate prices as in old backend
            usdTVL: balance.balance * BigInt(price.priceUsd),
            ethTVL: BigInt(0)
          })
        }
      }
    
      return tvls
    }
}

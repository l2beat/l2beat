import path from 'path'
import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import { LocalStorage } from './LocalStorage'
import { ValueService } from './ValueService'
import { extractPricesAndAmounts } from './mapConfig'
import type { BalanceProvider } from './providers/BalanceProvider'
import type { CirculatingSupplyProvider } from './providers/CirculatingSupplyProvider'
import type { PriceProvider } from './providers/PriceProvider'
import type { TotalSupplyProvider } from './providers/TotalSupplyProvider'
import type { TokenValue, TvsConfig } from './types'

export class LocalExecutor {
  private readonly dataFormulaExecutor: DataFormulaExecutor
  private readonly valueService: ValueService

  constructor(
    private priceProvider: PriceProvider,
    private circulatingSupplyProvider: CirculatingSupplyProvider,
    private blockProviders: Map<string, BlockProvider>,
    private totalSupplyProvider: TotalSupplyProvider,
    private balanceProvider: BalanceProvider,
    private logger: Logger,
  ) {
    const storage = new LocalStorage(path.join(__dirname, 'local-data.json'))
    this.dataFormulaExecutor = new DataFormulaExecutor(
      storage,
      priceProvider,
      circulatingSupplyProvider,
      blockProviders,
      totalSupplyProvider,
      balanceProvider,
      logger,
    )
    this.valueService = new ValueService(storage)
  }

  async run(
    config: TvsConfig,
    timestamps: UnixTime[],
    latestMode: boolean,
  ): Promise<Map<number, TokenValue[]>> {
    if (latestMode) {
      this.logger.info(`Running in latest mode`)
    }

    const { prices, amounts } = extractPricesAndAmounts(config)

    await this.dataFormulaExecutor.execute(
      prices,
      amounts,
      timestamps,
      latestMode,
    )

    return await this.valueService.calculate(config, timestamps)
  }
}

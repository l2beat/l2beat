import path from 'path'
import type { UnixTime } from '@l2beat/shared-pure'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import { LocalStorage } from './LocalStorage'
import { ValueService } from './ValueService'
import { extractPricesAndAmounts } from './mapConfig'
import type { TokenValue, TvsConfig } from './types'

export class LocalExecutor {
  private readonly dataFormulaExecutor: DataFormulaExecutor
  private readonly valueService: ValueService

  constructor() {
    const storage = new LocalStorage(path.join(__dirname, 'local-data.json'))
    this.dataFormulaExecutor = new DataFormulaExecutor(storage)
    this.valueService = new ValueService(storage)
  }

  async run(
    config: TvsConfig,
    timestamps: UnixTime[],
  ): Promise<Map<number, TokenValue[]>> {
    const { prices, amounts } = extractPricesAndAmounts(config)

    await this.dataFormulaExecutor.execute(prices, amounts, timestamps)

    return await this.valueService.calculate(config, timestamps)
  }
}

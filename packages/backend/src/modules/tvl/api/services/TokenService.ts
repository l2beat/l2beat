import {
  assert,
  EthereumAddress,
  TokenTvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import { getTokenCharts } from '../utils/chartsUtils'
import { ApiProject } from '../utils/types'
import { AmountsDataService } from './data/AmountsDataService'
import { PricesDataService } from './data/PricesDataService'

interface Dependencies {
  configMapping: ConfigMapping
  pricesDataService: PricesDataService
  amountsDataService: AmountsDataService
  syncOptimizer: SyncOptimizer
}

export class TokenService {
  constructor(private readonly $: Dependencies) {}

  async getTokenChart(
    targetTimestamp: UnixTime,
    project: ApiProject,
    token: { address: EthereumAddress | 'native'; chain: string },
  ): Promise<TokenTvlApiCharts> {
    const amountConfigs = this.$.configMapping.getAmountsByProjectAndToken(
      project.id,
      token,
    )

    assert(amountConfigs.length > 0, 'Amount config should be defined')

    const priceConfig = this.$.configMapping.getPriceConfigFromAmountConfig(
      amountConfigs[0],
    )
    const decimals = amountConfigs[0].decimals

    const amounts = await this.$.amountsDataService.getAmounts(
      amountConfigs,
      targetTimestamp,
    )

    const prices = await this.$.pricesDataService.getPrices(
      [priceConfig],
      targetTimestamp,
    )

    const minTimestamp = amountConfigs.reduce(
      (a, b) => UnixTime.max(a, b.sinceTimestamp),
      UnixTime.now(),
    )

    return getTokenCharts(dailyStart, timestamp, amountsAndPrices, decimals)
  }
}

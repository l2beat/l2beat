import {
  assert,
  EthereumAddress,
  TokenTvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { getTokenCharts } from '../utils/chartsUtils'
import { ApiProject } from '../utils/types'
import { DataService } from './DataService'

interface Dependencies {
  configMapping: ConfigMapping
  dataService: DataService
}

export class TokenService {
  constructor(private readonly $: Dependencies) {}

  async getTokenChart(
    timestamp: UnixTime,
    project: ApiProject,
    token: { address: EthereumAddress | 'native'; chain: string },
  ): Promise<TokenTvlApiCharts> {
    const amountConfigs = this.$.configMapping.getAmountsByProjectAndToken(
      token,
      project,
    )

    assert(amountConfigs.length > 0, 'Amount config should be defined')

    const priceConfig = this.$.configMapping.getPriceConfigFromAmountConfig(
      amountConfigs[0],
    )
    const decimals = amountConfigs[0].decimals

    const { amountsAndPrices, dailyStart, hourlyStart, sixHourlyStart } =
      await this.$.dataService.getPricesAndAmountsForToken(
        amountConfigs.map((x) => x.configId),
        priceConfig.configId,
        project.minTimestamp,
        timestamp,
      )

    return getTokenCharts(
      dailyStart,
      timestamp,
      amountsAndPrices,
      decimals,
      sixHourlyStart,
      hourlyStart,
    )
  }
}

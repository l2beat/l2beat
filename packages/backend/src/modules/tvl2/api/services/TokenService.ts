import {
  assert,
  EthereumAddress,
  TokenTvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { getTokenCharts } from '../utils/chartsUtils'
import { ApiProject } from '../utils/types'
import { DatabaseReadingService } from './DatabaseReadingService'

interface Dependencies {
  configMapping: ConfigMapping
  databaseReadingService: DatabaseReadingService
}

export class TokenService {
  constructor(private readonly $: Dependencies) {}

  async getTokenChart(
    token: { address: EthereumAddress | 'native'; chain: string },
    project: ApiProject,
    lastHour: UnixTime,
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
      await this.$.databaseReadingService.getPricesAndAmountsForToken(
        amountConfigs.map((x) => x.configId),
        priceConfig.configId,
        project.minTimestamp,
        lastHour,
      )

    return getTokenCharts(
      dailyStart,
      lastHour,
      amountsAndPrices,
      decimals,
      sixHourlyStart,
      hourlyStart,
    )
  }
}

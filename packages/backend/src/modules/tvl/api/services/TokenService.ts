import {
  assert,
  EthereumAddress,
  TokenTvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { Clock } from '../../../../tools/Clock'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { getTokenCharts } from '../utils/chartsUtils'
import { ApiProject } from '../utils/types'
import { AmountsDataService } from './data/AmountsDataService'
import { PricesDataService } from './data/PricesDataService'

interface Dependencies {
  configMapping: ConfigMapping
  pricesDataService: PricesDataService
  amountsDataService: AmountsDataService
  clock: Clock
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

    const amounts = await this.$.amountsDataService.getAmounts(
      amountConfigs,
      targetTimestamp,
    )

    const prices = await this.$.pricesDataService.getPrices(
      [priceConfig],
      targetTimestamp,
    )

    const minTimestamp = amountConfigs.reduce(
      (a, b) => UnixTime.min(a, b.sinceTimestamp),
      UnixTime.now(),
    )

    const d: Dictionary<bigint> = {}

    const t = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    for (const tt of t) {
      let sum = 0n

      Object.values(amounts.amounts).forEach((a) => {
        const b = a[tt.toString()] ?? 0n
        sum += b
      })

      d[tt.toString()] = sum
    }

    return getTokenCharts(
      targetTimestamp,
      minTimestamp.toEndOf('day'),
      this.$.clock.getSixHourlyCutoff(targetTimestamp, {
        minTimestampOverride: minTimestamp,
      }),
      this.$.clock.getHourlyCutoff(targetTimestamp, {
        minTimestampOverride: minTimestamp,
      }),
      d,
      prices.prices[priceConfig.configId],
      amountConfigs[0].decimals,
    )
  }
}

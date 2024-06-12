import {
  assert,
  EthereumAddress,
  TokenTvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { createAssetId } from '../../utils/createAssetId'
import { getTokenCharts } from '../utils/chartsUtils'
import { AmountConfigMap, ApiProject, PriceConfigIdMap } from '../utils/types'
import { ControllerService } from './ControllerService'

interface TokenTvlServiceDependencies {
  amountConfig: AmountConfigMap
  priceConfigs: PriceConfigIdMap
  controllerService: ControllerService
}

export class TokenTvlService {
  constructor(private readonly $: TokenTvlServiceDependencies) {}

  async getTokenChart(
    token: { address: EthereumAddress | 'native'; chain: string },
    project: ApiProject,
    lastHour: UnixTime,
  ): Promise<TokenTvlApiCharts> {
    const projectAmounts = this.$.amountConfig.get(project.id)
    assert(projectAmounts)

    const assetId = createAssetId(token)
    const amountConfigs = projectAmounts.filter(
      (x) => createAssetId(x) === assetId,
    )
    assert(
      amountConfigs.every((x) => x.decimals === amountConfigs[0].decimals),
      'Decimals mismatch!',
    )
    const decimals = amountConfigs[0].decimals

    const priceConfig = this.$.priceConfigs.get(assetId)
    assert(priceConfig, 'PriceId not found!')

    const { amountsAndPrices, dailyStart, hourlyStart, sixHourlyStart } =
      await this.$.controllerService.getPricesAndAmountsForToken(
        amountConfigs.map((x) => x.configId),
        priceConfig.priceId,
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

import { assert } from '@l2beat/backend-tools'
import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ApiProject } from '../api/utils/types'
import { createAmountId } from './createAmountId'
import { AssetId, createAssetId } from './createAssetId'
import { createPriceId } from './createPriceId'

export class IdConverter {
  prices: Map<AssetId, PriceConfigEntry & { configId: string }>
  amounts: Map<ProjectId, (AmountConfigEntry & { configId: string })[]>

  constructor(prices: PriceConfigEntry[], amounts: AmountConfigEntry[]) {
    this.prices = getPricesMap(prices)
    this.amounts = getAmountsMap(amounts)
  }

  getPriceConfigFromAmountConfig(
    amountConfig: AmountConfigEntry,
  ): PriceConfigEntry & { configId: string } {
    const assetId = createAssetId(amountConfig)

    const priceConfig = this.prices.get(assetId)

    assert(
      priceConfig,
      `Price config not found for asset ${assetId} on chain ${amountConfig.chain}`,
    )

    return priceConfig
  }

  getAmountsByProjectAndToken(
    token: {
      address: EthereumAddress | 'native'
      chain: string
    },
    project: ApiProject,
  ): (AmountConfigEntry & { configId: string })[] {
    const projectAmounts = this.amounts.get(project.id)
    assert(projectAmounts)

    const assetId = createAssetId(token)
    const amountConfigs = projectAmounts.filter(
      (x) => createAssetId(x) === assetId,
    )
    assert(
      amountConfigs.every((x) => x.decimals === amountConfigs[0].decimals),
      'Decimals mismatch!',
    )

    return amountConfigs
  }
}

function getPricesMap(prices: PriceConfigEntry[]) {
  const result = new Map<string, PriceConfigEntry & { configId: string }>()
  for (const p of prices) {
    result.set(createAssetId(p), { ...p, configId: createPriceId(p) })
  }

  return result
}

function getAmountsMap(amounts: AmountConfigEntry[]) {
  const groupedEntries = Object.entries(groupBy(amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    return [projectId, amountWithIds] as const
  })

  return new Map(amountConfigEntries)
}

import { assert } from '@l2beat/backend-tools'
import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { createAmountId } from './createAmountId'
import { AssetId, createAssetId } from './createAssetId'
import { createPriceId } from './createPriceId'

export class ConfigMapping {
  private pricesByAssetId: Map<AssetId, PriceConfigEntry & { configId: string }>
  private amountsByConfigId: Map<
    string,
    AmountConfigEntry & { configId: string }
  >
  private amountsByProject: Map<
    ProjectId,
    (AmountConfigEntry & { configId: string })[]
  >

  constructor(prices: PriceConfigEntry[], amounts: AmountConfigEntry[]) {
    this.pricesByAssetId = getPricesMap(prices)
    this.amountsByConfigId = getAmountsMap(amounts)
    this.amountsByProject = getAmountsByProjectMap(amounts)
  }

  get prices(): (PriceConfigEntry & { configId: string })[] {
    return [...this.pricesByAssetId.values()]
  }

  get amounts(): (AmountConfigEntry & { configId: string })[] {
    return [...this.amountsByConfigId.values()]
  }

  getPriceConfigFromAmountConfig(
    amountConfig: AmountConfigEntry,
  ): PriceConfigEntry & { configId: string } {
    const assetId = createAssetId(amountConfig)

    const priceConfig = this.pricesByAssetId.get(assetId)

    assert(
      priceConfig,
      `Price config not found for asset ${assetId} on chain ${amountConfig.chain}`,
    )

    return priceConfig
  }

  getAmountsByProjectAndToken(
    projectId: ProjectId,
    token: {
      address: EthereumAddress | 'native'
      chain: string
    },
  ): (AmountConfigEntry & { configId: string })[] {
    const projectAmounts = this.amountsByProject.get(projectId)
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

  getAmountsByProject(
    projectId: ProjectId,
  ): (AmountConfigEntry & { configId: string })[] {
    const projectAmounts = this.amountsByProject.get(projectId)
    assert(projectAmounts)

    return projectAmounts
  }

  getAmountConfig(configId: string) {
    const config = this.amountsByConfigId.get(configId)

    assert(config, `Config not found ${configId}`)

    return config
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
  const result = new Map<string, AmountConfigEntry & { configId: string }>()
  for (const p of amounts) {
    result.set(createAmountId(p), { ...p, configId: createAmountId(p) })
  }

  return result
}

function getAmountsByProjectMap(amounts: AmountConfigEntry[]) {
  const groupedEntries = Object.entries(groupBy(amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    return [projectId, amountWithIds] as const
  })

  return new Map(amountConfigEntries)
}

import {
  assert,
  type AmountConfigEntry,
  AssetId,
  type EthereumAddress,
  type PriceConfigEntry,
  ProjectId,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { createAmountId } from './createAmountId'
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

  constructor(
    prices: PriceConfigEntry[],
    amounts: AmountConfigEntry[],
    projects: ProjectId[],
  ) {
    this.pricesByAssetId = getPricesMap(prices)
    this.amountsByConfigId = getAmountsMap(amounts)
    this.amountsByProject = getAmountsByProjectMap(amounts, projects)
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
    let assetId: AssetId
    switch (amountConfig.type) {
      case 'circulatingSupply':
      case 'preminted':
      case 'totalSupply':
      case 'escrow':
        assetId = amountConfig.assetId
        break
      case 'aggLayerL2Token':
      case 'elasticChainL2Token':
        assetId = AssetId.create('ethereum', amountConfig.l1Address)
        break
      case 'aggLayerNativeEtherPreminted':
      case 'aggLayerNativeEtherWrapped':
      case 'elasticChainEther':
        assetId = AssetId.create('ethereum', 'native')
        break
      default:
        assertUnreachable(amountConfig)
    }
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

    const assetId = AssetId.create(token.chain, token.address)
    const amountConfigs = projectAmounts.filter((x) => x.assetId === assetId)
    assert(
      amountConfigs.every((x) => x.decimals === amountConfigs[0]?.decimals),
      'Decimals mismatch!',
    )

    return amountConfigs
  }

  getAmountsByProject(
    projectId: ProjectId,
  ): (AmountConfigEntry & { configId: string })[] {
    const projectAmounts = this.amountsByProject.get(projectId)
    assert(projectAmounts, `Config not found for ${projectId}`)

    return projectAmounts
  }

  getAmountConfig(configId: string) {
    const config = this.amountsByConfigId.get(configId)

    assert(config, `Config not found ${configId}`)

    return config
  }
}

function getPricesMap(prices: PriceConfigEntry[]) {
  const result = new Map<AssetId, PriceConfigEntry & { configId: string }>()
  for (const p of prices) {
    result.set(AssetId.create(p.chain, p.address), {
      ...p,
      configId: createPriceId(p),
    })
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

function getAmountsByProjectMap(
  amounts: AmountConfigEntry[],
  projects: ProjectId[],
) {
  const result = new Map<
    ProjectId,
    (AmountConfigEntry & { configId: string })[]
  >(projects.map((p) => [p, []]))

  const groupedEntries = Object.entries(groupBy(amounts, 'project'))

  groupedEntries.forEach(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    result.set(projectId, amountWithIds)
  })

  return result
}

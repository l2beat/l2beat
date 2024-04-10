import {
  AmountConfigEntry,
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { createAmountId } from '../utils/createAmountId'

interface Tvl2Project {
  id: ProjectId
  minTimestamp: UnixTime
  indexers: { get safeHeight(): number }[]
}

interface Tvl2Result {
  daily: Tvl2TimestampedResult[]
}

interface Tvl2TimestampedResult {
  timestamp: number
  projects: Record<string, Tvl2ProjectResult>
}

interface Tvl2ProjectResult {
  canonical: number
  external: number
  native: number
}

type AmountConfigMap = Map<
  ProjectId,
  (AmountConfigEntry & { configId: string })[]
>

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly priceConfig: Map<string, number>

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly priceIndexer: { get safeHeight(): number },
    private readonly projects: Tvl2Project[],
    config: Tvl2Config,
  ) {
    this.amountConfig = getAmountConfigMap(config)
    this.priceConfig = new Map(
      config.prices.map((x) => [createAssetId(x), x.decimals]),
    )
  }

  async getTvl(): Promise<Tvl2Result> {
    const minTimestamp = this.projects
      .map((x) => x.minTimestamp)
      .reduce((a, b) => UnixTime.min(a, b))
      .toEndOf('day')

    const maxTimestamp = this.projects
      .flatMap((x) => x.indexers)
      .map((x) => new UnixTime(x.safeHeight))
      .concat(new UnixTime(this.priceIndexer.safeHeight))
      .reduce((a, b) => UnixTime.min(a, b))
      .toStartOf('day')

    const result: Tvl2Result = {
      daily: [],
    }

    for (let t = minTimestamp; t.lte(maxTimestamp); t = t.add(1, 'days')) {
      result.daily.push(await this.getTvlAt(t))
    }
    return result
  }

  async getTvlAt(timestamp: UnixTime): Promise<Tvl2TimestampedResult> {
    const results: Record<string, Tvl2ProjectResult> = {}
    for (const project of this.projects) {
      const maxTimestamp = project.indexers
        .map((x) => x.safeHeight)
        .concat(this.priceIndexer.safeHeight)
        .reduce((a, b) => Math.min(a, b))

      if (
        timestamp.gte(project.minTimestamp) &&
        timestamp.toNumber() <= maxTimestamp
      ) {
        results[project.id.toString()] = await this.getProjectTvl(
          project.id,
          timestamp,
        )
      }
    }
    return {
      timestamp: timestamp.toNumber(),
      projects: results,
    }
  }

  async getProjectTvl(
    project: ProjectId,
    timestamp: UnixTime,
  ): Promise<Tvl2ProjectResult> {
    const projectConfigs = this.amountConfig.get(project)
    assert(projectConfigs, 'Config not found')

    const configIds = projectConfigs.map((x) => x.configId)
    const records = await this.amountRepository.getByConfigIdsAndTimestamp(
      configIds,
      timestamp,
    )
    assert(records.length === configIds.length, 'Records and config mismatch')

    const prices = await this.priceRepository.getByTimestamp(timestamp)

    const results = {
      canonical: 0,
      external: 0,
      native: 0,
    }

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const amountConfig = projectConfigs[i]
      assert(amountConfig.configId === record.configId, 'Config mismatch')

      const assetId = createAssetId({
        address: amountConfig.address,
        chain: amountConfig.chain,
      })
      const price = prices.find((x) => createAssetId(x) === assetId)
      assert(price, 'Price not found')

      const decimals = this.priceConfig.get(assetId)
      assert(decimals, 'Decimals not found')

      results[amountConfig.source] +=
        (Number(record.amount) * price.priceUsd) / decimals
    }
    return results
  }
}

function getAmountConfigMap(config: Tvl2Config) {
  const groupedEntries = Object.entries(groupBy(config.amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(
    ([k, v]) =>
      [
        ProjectId(k),
        v
          .map((x) => ({ ...x, configId: createAmountId(x) }))
          .sort((a, b) => a.configId.localeCompare(b.configId)),
      ] as const,
  )

  return new Map(amountConfigEntries)
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}
